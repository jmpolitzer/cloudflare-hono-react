import path from "node:path";
import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkersProject(() => ({
	plugins: [tsconfigPaths()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@app-type": path.resolve(__dirname, "./functions/api/[[route]].ts"),
		},
	},
	test: {
		globals: true,
		reporters: ["verbose"],
		poolOptions: {
			workers: {
				wrangler: { configPath: "./wrangler.toml" },
				miniflare: {
					bindings: {
						// Mock bindings
						BASE_URL: "http://localhost:8787",
						KINDE_AUTH_DOMAIN: "https://mock.kinde.com",
						KINDE_CLIENT_ID: "mock-client-id",
						KINDE_CLIENT_SECRET: "mock-client-secret",
						KINDE_REDIRECT_URL: "http://localhost:8787/auth/callback",
						KINDE_M2M_ID: "mock-m2m-id",
						KINDE_M2M_SECRET: "mock-m2m-secret",
					},
				},
			},
		},
	},
}));
