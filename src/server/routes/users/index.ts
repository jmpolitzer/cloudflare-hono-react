import {
	unauthorizedRequestException,
	unknownRequestException,
	zodBadRequestException,
} from "@/server/utils/errors";
import {
	ensureUser as defaultEnsureUser,
	initKindeApi as defaultInitKindeApi,
	getKindeClient as defaultKindeClient,
	refreshUser as defaultRefreshUser,
	sessionManager,
} from "@/server/utils/kinde";
import type { KindeRouteBindings } from "@/server/utils/kinde";
import { editUserSchema } from "@/shared/validations/users";
import { zValidator } from "@hono/zod-validator";
import { Users as defaultUsers } from "@kinde/management-api-js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export function createUsersRoutes({
	getKindeClient = defaultKindeClient,
	initKindeApi = defaultInitKindeApi,
	ensureUser = defaultEnsureUser,
	refreshUser = defaultRefreshUser,
	Users = defaultUsers,
}: KindeRouteBindings = {}) {
	// Create Hono app resource group with Cloudflare bindings
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const users = app
		.use(getKindeClient)
		.use(initKindeApi)
		.use(ensureUser)
		.get("/:userId/orgs", async (c) => {
			const userOrgs = await c.var.kindeClient.getClaim(
				sessionManager(c),
				"organizations",
				"id_token",
			);

			return c.json({ orgs: userOrgs.value as { name: string; id: string }[] });
		})
		.patch(
			"/:userId",
			zValidator("form", editUserSchema, (result, c) => {
				if (!result.success) {
					throw zodBadRequestException(result.error);
				}
			}),
			async (c) => {
				try {
					const { userId } = c.req.param();

					/* Only users can make updates on their own behalf. */
					if (userId !== c.var.user.id) {
						throw unauthorizedRequestException();
					}

					const formData = c.req.valid("form");

					await Users.updateUser({
						id: userId,
						requestBody: {
							given_name: formData.firstName,
							family_name: formData.lastName,
						},
					});

					await refreshUser({
						userId: c.var.user.id,
						kindeClient: c.var.kindeClient,
						manager: sessionManager(c),
					});

					return c.json({ success: true });
				} catch (error) {
					if (error instanceof HTTPException) {
						throw error;
					}

					throw unknownRequestException(error);
				}
			},
		);

	return users;
}

export const users = createUsersRoutes();
