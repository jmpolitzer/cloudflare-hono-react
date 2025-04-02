import { unknownRequestException } from "@/server/utils/errors";
import {
	ensureUser as defaultEnsureUser,
	getKindeClient as defaultKindeClient,
	sessionManager,
} from "@/server/utils/kinde";
import type { KindeRouteBindings } from "@/server/utils/kinde";
import { DEFAULT_ORG_NAME } from "@/shared/constants";
import { Hono } from "hono";

export function createAuthRoutes({
	getKindeClient = defaultKindeClient,
	ensureUser = defaultEnsureUser,
}: KindeRouteBindings = {}) {
	// Create Hono app resource group with Cloudflare bindings
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const auth = app
		.use(getKindeClient)
		.get("/logout", async (c) => {
			try {
				const logoutUrl = await c.var.kindeClient.logout(sessionManager(c));

				return c.redirect(logoutUrl.toString());
			} catch (error) {
				throw unknownRequestException(error);
			}
		})
		.get("/login", async (c) => {
			const orgCode = c.req.query("org_code");
			const loginOpts = orgCode ? { org_code: orgCode } : undefined;

			try {
				const loginUrl = await c.var.kindeClient.login(
					sessionManager(c),
					loginOpts,
				);

				return c.redirect(loginUrl.toString());
			} catch (error) {
				throw unknownRequestException(error);
			}
		})
		.get("/register", async (c) => {
			try {
				// This is the same as register method, except it creates an organization in the background.
				const registerUrl = await c.var.kindeClient.createOrg(
					sessionManager(c),
					{
						org_name: DEFAULT_ORG_NAME,
					},
				);

				return c.redirect(registerUrl.toString());
			} catch (error) {
				throw unknownRequestException(error);
			}
		})
		.get("/callback", async (c) => {
			try {
				await c.var.kindeClient.handleRedirectToApp(
					sessionManager(c),
					new URL(c.req.url),
				);

				return c.redirect("/");
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
