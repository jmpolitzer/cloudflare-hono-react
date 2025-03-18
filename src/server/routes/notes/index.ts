import * as schema from "@/server/db/schema";
import { unknownRequestException } from "@/server/utils/errors";
import { ensureUser, getKindeClient } from "@/server/utils/kinde";
import { zValidator } from "@hono/zod-validator";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

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

// Note ID schema
const noteIdSchema = z.string().transform((val) => {
	const parsed = Number.parseInt(val, 10);
	if (Number.isNaN(parsed)) throw new Error("Invalid note ID");
	return parsed;
});

export const notes = app
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
				orgId: c.var.user.current_org as string,
			});

			return c.json({ note: newNote }, 201);
		} catch (error) {
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
				.where(eq(schema.notesTable.orgId, c.var.user.current_org as string));

			// Get paginated notes
			const notes = await db.query.notesTable.findMany({
				where: (note, { eq }) =>
					eq(note.orgId, c.var.user.current_org as string),
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
			throw unknownRequestException(error);
		}
	})
	.get(
		"/:id",
		zValidator("param", z.object({ id: noteIdSchema })),
		async (c) => {
			try {
				const { id } = c.req.valid("param");
				const db = drizzle(c.env.DB, { schema });

				const note = await db.query.notesTable.findFirst({
					where: (note, { eq, and }) =>
						and(
							eq(note.id, id),
							eq(note.orgId, c.var.user.current_org as string),
						),
				});

				if (!note) {
					return c.json({ error: "Note not found" }, 404);
				}

				return c.json({ note });
			} catch (error) {
				throw unknownRequestException(error);
			}
		},
	);
