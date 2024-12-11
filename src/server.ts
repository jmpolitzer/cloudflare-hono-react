import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: CloudflareBindings }>().basePath("/api");

app.use(
	"*",
	cors({
		// TODO: Replace this with the URL of your deployed frontend
		origin: ["http://localhost:5173"],
	}),
);

export default app;
