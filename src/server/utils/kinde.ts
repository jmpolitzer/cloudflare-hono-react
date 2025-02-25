import {
	GrantType,
	createKindeServerClient,
} from "@kinde-oss/kinde-typescript-sdk";
import { init as initKindeManagementApi } from "@kinde/management-api-js";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import type { SessionManager, UserType } from "@kinde-oss/kinde-typescript-sdk";
import type { Context, MiddlewareHandler } from "hono";
import type { CookieOptions } from "hono/utils/cookie";

interface Variables {
	kindeClient: ReturnType<typeof initKindeClient>;
	// Snake case is used to match the API response.
	user: UserType & { current_org: string | null };
}

interface KindeBindings {
	KINDE_AUTH_DOMAIN: string;
	KINDE_CLIENT_ID: string;
	KINDE_CLIENT_SECRET: string;
	KINDE_REDIRECT_URL: string;
	KINDE_LOGOUT_REDIRECT_URL: string;
	KINDE_M2M_ID: string;
	KINDE_M2M_SECRET: string;
}

const initKindeClient = (bindings: KindeBindings) =>
	createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		authDomain: bindings.KINDE_AUTH_DOMAIN!,
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		clientId: bindings.KINDE_CLIENT_ID!,
		clientSecret: bindings.KINDE_CLIENT_SECRET,
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		redirectURL: bindings.KINDE_REDIRECT_URL!,
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		logoutRedirectURL: bindings.KINDE_LOGOUT_REDIRECT_URL!,
	});

export const getKindeClient: MiddlewareHandler<{
	Bindings: KindeBindings;
	Variables: Variables;
}> = async (c, next) => {
	const kindeClient = initKindeClient(c.env);

	c.set("kindeClient", kindeClient);
	await next();
};

export const initKindeApi: MiddlewareHandler<{
	Bindings: KindeBindings;
	Variables: Variables;
}> = async (c, next) => {
	initKindeManagementApi({
		kindeDomain: c.env.KINDE_AUTH_DOMAIN,
		clientId: c.env.KINDE_M2M_ID,
		clientSecret: c.env.KINDE_M2M_SECRET,
	});

	await next();
};

export const getUser: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	try {
		const manager = sessionManager(c);
		const isAuthenticated = await c.var.kindeClient.isAuthenticated(manager);

		if (!isAuthenticated) {
			return c.json({ message: "Unauthorized" }, 401);
		}

		// While checking if a user is authenticated, we can also check if the user is already stored in the context.
		if (!c.var.user) {
			const profile = await c.var.kindeClient.getUserProfile(manager);
			const currentOrg = await c.var.kindeClient.getOrganization(manager);

			c.set("user", { ...profile, current_org: currentOrg.orgCode });
		}

		await next();
	} catch (e) {
		console.error(e);
		return c.json({ message: "Unauthorized" }, 401);
	}
};

export const sessionManager = (c: Context): SessionManager => ({
	async getSessionItem(key: string) {
		const result = getCookie(c, key);
		return result;
	},
	async setSessionItem(key: string, value: unknown) {
		const cookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: "Lax",
		} as CookieOptions;

		if (typeof value === "string") {
			setCookie(c, key, value, cookieOptions);
		} else {
			setCookie(c, key, JSON.stringify(value), cookieOptions);
		}
	},
	async removeSessionItem(key: string) {
		deleteCookie(c, key);
	},
	async destroySession() {
		const cookies = ["id_token", "access_token", "user", "refresh_token"];

		for (const cookie of cookies) {
			deleteCookie(c, cookie);
		}
	},
});
