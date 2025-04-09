import path from "node:path";
import {
	defineWorkersProject,
	readD1Migrations,
} from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersProject(async () => {
	const migrationsPath = path.join(__dirname, "drizzle");
	const migrations = await readD1Migrations(migrationsPath);

	return {
		plugins: [tsconfigPaths()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@app-type": path.resolve(__dirname, "./functions/api/[[route]].ts"),
			},
		},
		test: {
			include: ["./tests/api/*.test.ts"],
			globals: true,
			reporters: ["verbose"],
			setupFiles: ["./tests/vitest-setup.ts"],
			poolOptions: {
				workers: {
					singleWorker: true,
					isolatedStorage: false,
					miniflare: {
						compatibilityFlags: ["nodejs_compat"],
						compatibilityDate: "2024-12-05",
						d1Databases: ["DB"],
						bindings: { TEST_MIGRATIONS: migrations },
					},
				},
			},
		},
	};
});
