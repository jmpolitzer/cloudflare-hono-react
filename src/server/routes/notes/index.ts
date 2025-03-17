import * as schema from "@/server/db/schema";
import { ensureUser, getKindeClient } from "@/server/utils/kinde";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { createInsertSchema } from "drizzle-zod";
import { Hono } from "hono";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const notes = app
	.use(getKindeClient)
	.use(ensureUser)
	.post(
		"/",
		zValidator("form", createInsertSchema(schema.notesTable)),
		async (c) => {
			const formData = c.req.valid("form");
			const db = drizzle(c.env.DB, { schema });

			const newNote = await db.insert(schema.notesTable).values({
				...formData,
			});

			return c.json({ note: newNote }, 201);
		},
	)
	.get("/", async (c) => {
		const db = drizzle(c.env.DB, { schema });
		const notes = await db.query.notesTable.findMany({
			where: (note, { eq, and }) =>
				and(
					eq(note.userId, c.var.user.id as string),
					eq(note.orgId, c.var.user.current_org as string),
				),
		});

		return c.json({ notes });
	})
	.get("/:id", async (c) => {
		const db = drizzle(c.env.DB, { schema });
		const note = await db.query.notesTable.findFirst({
			where: (note, { eq, and }) =>
				and(
					eq(note.id, Number.parseInt(c.req.param("id") ?? "")),
					eq(note.userId, c.var.user.id as string),
					eq(note.orgId, c.var.user.current_org as string),
				),
		});

		return c.json({ note });
	});
