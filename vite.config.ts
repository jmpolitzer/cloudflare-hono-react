import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		minify: true,
		outDir: "./dist",
	},
	plugins: [react()],
	server: {
		proxy: {
			"/api": "http://localhost:8788",
		},
	},
});
