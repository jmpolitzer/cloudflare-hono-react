import {
	ensureUser,
	getKindeClient,
	sessionManager,
} from "@/server/utils/kinde";
import { Hono } from "hono";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const users = app
	.use(getKindeClient) // This middleware is used to get the Kinde client. This must be listed first to use ensureUser.
	.use(ensureUser) // This middleware is used to check if the current user is authenticated.
	.get("/:id/orgs", async (c) => {
		const userOrgs = await c.var.kindeClient.getClaim(
			sessionManager(c),
			"organizations",
			"id_token",
		);

		return c.json({ orgs: userOrgs.value as { name: string; id: string }[] });
	});
