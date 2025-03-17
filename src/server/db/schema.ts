import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notesTable = sqliteTable(
	"notes",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		title: text().notNull(),
		description: text(),
		userId: text("user_id").notNull(), // External IDP user ID
		orgId: text("org_id").notNull(), // External IDP organization ID
		createdAt: text("created_at").notNull().default(sql`(current_timestamp)`),
		updatedAt: text("updated_at")
			.notNull()
			.default(sql`(current_timestamp)`)
			.$onUpdate(() => sql`(current_timestamp)`),
	},
	(table) => ({
		userIdIdx: index("user_id_idx").on(table.userId),
		orgIdIdx: index("org_id_idx").on(table.orgId),
	}),
);
