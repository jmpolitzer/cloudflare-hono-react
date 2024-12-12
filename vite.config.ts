import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		minify: true,
		outDir: "./dist",
	},
	plugins: [TanStackRouterVite(), viteReact()],
	server: {
		proxy: {
			"/api": "http://localhost:8788",
		},
	},
});
