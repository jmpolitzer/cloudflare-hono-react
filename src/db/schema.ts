import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notesTable = sqliteTable("notes", {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	description: text(),
	createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`(current_timestamp)`)
		.$onUpdate(() => sql`(current_timestamp)`),
});
