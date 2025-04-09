import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	testMatch: "*.spec.ts",
	fullyParallel: true,
	retries: 1,
	workers: 2,
	reporter: "html",
	use: {
		baseURL: "http://localhost:5173",
		headless: true,
		viewport: { width: 1280, height: 720 },
		actionTimeout: 10000,
	},
	projects: [
		{
			name: "chromium",
			use: { browserName: "chromium" },
		},
	],
	webServer: {
		command: "bun run dev",
		port: 5173,
		reuseExistingServer: !process.env.CI,
	},
});
