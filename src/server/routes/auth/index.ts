import {
	badRequestException,
	unknownRequestException,
	zodBadRequestException,
} from "@/server/utils/errors";
import {
	ensureUser as defaultEnsureUser,
	initKindeApi as defaultInitKindeApi,
	getKindeClient as defaultKindeClient,
	registerUserToOrg as defaultRegisterUserToOrg,
	sessionManager,
} from "@/server/utils/kinde";
import type { KindeRouteBindings } from "@/server/utils/kinde";
import {
	loginUserSchema,
	registerUserSchema,
} from "@/shared/validations/users";
import { zValidator } from "@hono/zod-validator";
import {
	Organizations as defaultOrganizations,
	Search as defaultSearch,
} from "@kinde/management-api-js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export function createAuthRoutes({
	getKindeClient = defaultKindeClient,
	ensureUser = defaultEnsureUser,
	initKindeApi = defaultInitKindeApi,
	registerUserToOrg = defaultRegisterUserToOrg,
	Organizations = defaultOrganizations,
	Search = defaultSearch,
}: KindeRouteBindings = {}) {
	// Create Hono app resource group with Cloudflare bindings
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const auth = app
		.use(getKindeClient)
		.use(initKindeApi)
		.get("/logout", async (c) => {
			try {
				const logoutUrl = await c.var.kindeClient.logout(sessionManager(c));

				return c.redirect(logoutUrl.toString());
			} catch (error) {
				throw unknownRequestException(error);
			}
		})
		.post(
			"/login",
			zValidator("form", loginUserSchema, (result, c) => {
				if (!result.success) {
					throw zodBadRequestException(result.error);
				}
			}),
			async (c) => {
				const orgCode = c.req.query("org_code");
				const loginOpts = orgCode ? { org_code: orgCode } : undefined;
				const formData = c.req.valid("form");

				try {
					const loginUrl = await c.var.kindeClient.login(sessionManager(c), {
						...loginOpts,
						authUrlParams: {
							connection_id: c.env.KINDE_CONNECTION_ID,
							login_hint: formData.email,
						},
					});

					return c.json({ redirectUrl: loginUrl.toString() });
				} catch (error) {
					throw unknownRequestException(error);
				}
			},
		)
		.post(
			"/register",
			zValidator("form", registerUserSchema, (result, c) => {
				if (!result.success) {
					throw zodBadRequestException(result.error);
				}
			}),
			async (c) => {
				const formData = c.req.valid("form");

				try {
					/* Create new org */
					const newOrg = await Organizations.createOrganization({
						requestBody: {
							name: formData.orgName,
							is_allow_registrations: true,
						},
					});

					if (!newOrg.organization?.code) {
						throw badRequestException();
					}

					/* Check to see if user already exists. Users can belong to multiple orgs. */
					const existingUser = await Search.searchUsers({
						query: formData.email,
					});

					/* Register first user to org with admin role. */
					await registerUserToOrg({
						orgId: newOrg.organization?.code,
						role: "admin",
						user: existingUser.results?.[0]?.id
							? existingUser.results[0].id
							: formData,
					});

					/* Since we are creating the org and user on our own, we don't need to go through the registration flow. */
					const loginUrl = await c.var.kindeClient.login(sessionManager(c), {
						org_code: newOrg.organization?.code,
						authUrlParams: {
							connection_id: c.env.KINDE_CONNECTION_ID,
							login_hint: formData.email,
						},
					});

					return c.json({ redirectUrl: loginUrl.toString() });
				} catch (error) {
					if (error instanceof HTTPException) {
						throw error;
					}

					throw unknownRequestException(error);
				}
			},
		)
		.get("/callback", async (c) => {
			try {
				await c.var.kindeClient.handleRedirectToApp(
					sessionManager(c),
					new URL(c.req.url),
				);

				return c.redirect("/dashboard");
			} catch (error) {
				throw unknownRequestException(error);
			}
		})
		.get("/me", ensureUser, async (c) => {
			const user = c.var.user;

			return c.json(user);
		});

	return auth;
}

export const auth = createAuthRoutes();
