import {
	ensureUser as defaultEnsureUser,
	getKindeClient as defaultKindeClient,
	sessionManager,
} from "@/server/utils/kinde";
import type { KindeRouteBindings } from "@/server/utils/kinde";
import { Hono } from "hono";

export function createUsersRoutes({
	getKindeClient = defaultKindeClient,
	ensureUser = defaultEnsureUser,
}: KindeRouteBindings = {}) {
	// Create Hono app resource group with Cloudflare bindings
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const users = app
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

	return users;
}

export const users = createUsersRoutes();
