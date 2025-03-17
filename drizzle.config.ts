import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
	path: ".dev.vars",
});

function getLocalD1DB() {
	try {
		const basePath = path.resolve(".wrangler");
		const dbFile = fs
			.readdirSync(basePath, { encoding: "utf-8", recursive: true })
			.find((f) => f.endsWith(".sqlite"));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err) {
		console.log(`Error  ${err}`);
	}
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/server/db/schema.ts",
	dialect: "sqlite",
	// Production
	...(process.env.NODE_ENV === "production"
		? {
				driver: "d1-http",
				dbCredentials: {
					// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
					accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
					// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
					databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
					// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
					token: process.env.CLOUDFLARE_D1_TOKEN!,
				},
			}
		: {
				// Local
				dbCredentials: {
					url: getLocalD1DB(),
				},
			}),
});
