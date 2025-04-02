import * as schema from "@/server/db/schema";
import {
	notFoundRequestException,
	unknownRequestException,
} from "@/server/utils/errors";
import {
	ensureUser as defaultEnsureUser,
	getKindeClient as defaultKindeClient,
} from "@/server/utils/kinde";
import type { KindeRouteBindings } from "@/server/utils/kinde";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

// Create a schema for the form data (without user/org fields)
const noteFormSchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title is too long"),
	description: z.string().max(10000, "Description is too long").optional(),
});

// Pagination schema
const paginationSchema = z.object({
	page: z
		.string()
		.optional()
		.transform((val) => (val ? Number.parseInt(val, 10) : 1)),
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? Number.parseInt(val, 10) : 10)),
});

export function createNotesRoutes({
	getKindeClient = defaultKindeClient,
	ensureUser = defaultEnsureUser,
}: KindeRouteBindings = {}) {
	// Create Hono app resource group with Cloudflare bindings
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const notes = app
		.use(getKindeClient)
		.use(ensureUser)
		.post("/", zValidator("form", noteFormSchema), async (c) => {
			try {
				const formData = c.req.valid("form");
				const db = drizzle(c.env.DB, { schema });

				// Add user_id and org_id from the current user
				// We know these are non-null after ensureUser middleware
				const newNote = await db.insert(schema.notesTable).values({
					title: formData.title,
					description: formData.description,
					userId: c.var.user.id as string,
					orgId: c.var.user.currentOrg as string,
				});

				return c.json({ note: newNote }, 201);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		})
		.get("/", zValidator("query", paginationSchema), async (c) => {
			try {
				const { page, limit } = c.req.valid("query");
				const offset = (page - 1) * limit;
				const db = drizzle(c.env.DB, { schema });

				// Get total count for pagination
				const [{ count }] = await db
					.select({ count: sql<number>`count(*)` })
					.from(schema.notesTable)
					.where(eq(schema.notesTable.orgId, c.var.user.currentOrg as string));

				// Get paginated notes
				const notes = await db.query.notesTable.findMany({
					where: (note, { eq }) =>
						eq(note.orgId, c.var.user.currentOrg as string),
					limit,
					offset,
					orderBy: (note, { desc }) => [desc(note.createdAt)],
				});

				return c.json({
					notes,
					pagination: {
						total: count,
						page,
						limit,
						totalPages: Math.ceil(count / limit),
					},
				});
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		})
		.get("/:noteId", async (c) => {
			try {
				const { noteId } = c.req.param();
				const db = drizzle(c.env.DB, { schema });

				const note = await db.query.notesTable.findFirst({
					where: (note, { eq, and }) =>
						and(
							eq(note.id, Number(noteId)),
							eq(note.orgId, c.var.user.currentOrg as string),
						),
				});

				if (!note) {
					throw notFoundRequestException();
				}

				return c.json({ note });
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		})
		.put("/:noteId", zValidator("form", noteFormSchema), async (c) => {
			try {
				const { noteId } = c.req.param();
				const formData = c.req.valid("form");
				const db = drizzle(c.env.DB, { schema });

				// First check if the note exists and belongs to the user's org
				const existingNote = await db.query.notesTable.findFirst({
					where: (note, { eq, and }) =>
						and(
							eq(note.id, Number(noteId)),
							eq(note.orgId, c.var.user.currentOrg as string),
						),
				});

				if (!existingNote) {
					throw notFoundRequestException();
				}

				// Update the note
				const updatedNote = await db
					.update(schema.notesTable)
					.set({
						title: formData.title,
						description: formData.description,
					})
					.where(eq(schema.notesTable.id, Number(noteId)))
					.returning();

				return c.json({ note: updatedNote[0] });
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		})
		.delete("/:noteId", async (c) => {
			try {
				const { noteId } = c.req.param();
				const db = drizzle(c.env.DB, { schema });

				// Check if the note exists, belongs to the user's org, and was created by the user
				const existingNote = await db.query.notesTable.findFirst({
					where: (note, { eq, and }) =>
						and(
							eq(note.id, Number(noteId)),
							eq(note.orgId, c.var.user.currentOrg as string),
							eq(note.userId, c.var.user.id as string),
						),
				});

				if (!existingNote) {
					throw notFoundRequestException(
						"Note not found or you don't have permission to delete it",
					);
				}

				// Delete the note
				await db
					.delete(schema.notesTable)
					.where(eq(schema.notesTable.id, Number(noteId)));

				return c.json({ success: true }, 200);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		});

	return notes;
}

export const notes = createNotesRoutes();
