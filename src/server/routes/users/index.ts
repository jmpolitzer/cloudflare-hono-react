/**
 * TODO:
 * 1. Add org switcher to the frontend.✅
 * 2. Add org switcher to the backend.✅
 * 3. Edit organization name - reset org context
 * 4. Invite users to organization.
 * 5. Remove users from organization.
 * 6. Ensure routes are protected via Postman
 * **/

import { Hono } from "hono";
import { getKindeClient, getUser, sessionManager } from "../../utils/kinde";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const users = app
	.use(getKindeClient) // This middleware is used to get the Kinde client. This must be listed first to use getUser.
	.use(getUser) // This middleware is used to check if the current user is authenticated.
	.get("/:id/orgs", async (c) => {
		const userOrgs = await c.var.kindeClient.getClaim(
			sessionManager(c),
			"organizations",
			"id_token",
		);

		return c.json({ orgs: userOrgs.value as { name: string; id: string }[] });
	});
