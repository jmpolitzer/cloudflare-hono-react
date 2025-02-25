/**
 * TODO:
 * 1. Add org switcher to the frontend.✅
 * 2. Add org switcher to the backend.
 * 3. Edit organization name
 * 4. Invite users to organization.
 * 5. Remove users from organization.
 * 6. Ensure routes are protected via Postman
 * **/

import { Hono } from "hono";
import { getKindeClient, getUser, sessionManager } from "../../utils/kinde";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const users = app
	.use(getKindeClient) // This middleware is used to get the Kinde client.
	.use(getUser) // This middleware is used to check if the current user is authenticated.
	// .use(initKindeApi) // This middleware is used to initialize the Kinde management API.
	.get("/:id/orgs", async (c) => {
		const userOrgs = await c.var.kindeClient.getClaim(
			sessionManager(c),
			"organizations",
			"id_token",
		);

		return c.json({ orgs: userOrgs.value as { name: string; id: string }[] });
	});
