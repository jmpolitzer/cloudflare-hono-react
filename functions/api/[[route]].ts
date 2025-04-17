import { auth } from "@/server/routes/auth";
import { contact } from "@/server/routes/contact";
import { notes } from "@/server/routes/notes";
import { orgs } from "@/server/routes/orgs";
import { users } from "@/server/routes/users";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

// Set base path and add resource route groups
const app = new Hono()
	.basePath("/api")
	.route("/contact", contact)
	.route("/notes", notes)
	.route("/users", users)
	.route("/orgs", orgs)
	.route("/auth", auth)
	.onError(errorHandler);

// Export app type for client (hc)
export type AppType = typeof app;

// Export onRequest handler for Cloudflare Functions - https://developers.cloudflare.com/pages/functions/
export const onRequest = handle(app);
