import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		minify: true,
		outDir: "./dist",
	},
	plugins: [
		TanStackRouterVite({
			routesDirectory: "./src/frontend/routes",
			generatedRouteTree: "./src/frontend/routeTree.gen.ts",
		}),
		viteReact(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/api": "http://localhost:8788",
		},
	},
});
