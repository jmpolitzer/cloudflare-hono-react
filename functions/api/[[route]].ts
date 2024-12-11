import { drizzle } from "drizzle-orm/d1";
import { handle } from "hono/cloudflare-pages";
import { notesTable } from "../../src/db/schema";
import server from "../../src/server";

const notesRoute = server.get("/notes", async (c) => {
	const db = drizzle(c.env.DB);
	const notes = await db.select().from(notesTable).all();

	return c.json({ notes });
});

export type NotesType = typeof notesRoute;
export const onRequest = handle(notesRoute);
