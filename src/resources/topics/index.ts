import { topicsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const topics = app
	.get("/", async (c) => {
		const db = drizzle(c.env.DB);
		const topics = await db.select().from(topicsTable).all();

		return c.json({ topics });
	})
	.get("/:id", async (c) => {
		const db = drizzle(c.env.DB);
		const topic = await db
			.select()
			.from(topicsTable)
			.where(eq(topicsTable.id, Number.parseInt(c.req.param("id") ?? "")));

		return c.json({ topic });
	});

export type AppType = typeof topics;
