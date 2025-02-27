import { auth } from "@/server/routes/auth";
import { notes } from "@/server/routes/notes";
import { orgs } from "@/server/routes/orgs";
import { topics } from "@/server/routes/topics";
import { users } from "@/server/routes/users";
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

// Set base path and add resource route groups
const app = new Hono()
	.basePath("/api")
	.route("/notes", notes)
	.route("/topics", topics)
	.route("/users", users)
	.route("/orgs", orgs)
	.route("/auth", auth);

// Export app type for client (hc)
export type AppType = typeof app;

// Export onRequest handler for Cloudflare Functions - https://developers.cloudflare.com/pages/functions/
export const onRequest = handle(app);
