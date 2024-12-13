import { notesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const notes = app
	.get("/", async (c) => {
		const db = drizzle(c.env.DB);
		const notes = await db.select().from(notesTable).all();

		return c.json({ notes });
	})
	.get("/:id", async (c) => {
		const db = drizzle(c.env.DB);
		const note = await db
			.select()
			.from(notesTable)
			.where(eq(notesTable.id, Number.parseInt(c.req.param("id") ?? "")));

		return c.json({ note });
	});

export type AppType = typeof notes;
