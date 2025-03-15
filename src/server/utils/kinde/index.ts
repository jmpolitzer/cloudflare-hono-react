import {
	GrantType,
	createKindeServerClient,
} from "@kinde-oss/kinde-typescript-sdk";
import {
	Roles,
	Users,
	init as initKindeManagementApi,
} from "@kinde/management-api-js";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import {
	forbiddenRequestException,
	unauthorizedRequestException,
	unknownRequestException,
} from "@/server/utils/errors";
import { MANAGE_ORG } from "@/shared/constants";
import type { SessionManager, UserType } from "@kinde-oss/kinde-typescript-sdk";
import type { get_roles_response } from "@kinde/management-api-js";
import type { Context, MiddlewareHandler } from "hono";
import type { CookieOptions } from "hono/utils/cookie";

interface Variables {
	kindeClient: ReturnType<typeof initKindeClient>;
	roles: get_roles_response["roles"];
	// Snake case is used to match the API response.
	user: UserType & { current_org: string | null } & { permissions: string[] };
}

interface KindeBindings {
	BASE_URL: string;
	KINDE_AUTH_DOMAIN: string;
	KINDE_CLIENT_ID: string;
	KINDE_CLIENT_SECRET: string;
	KINDE_REDIRECT_URL: string;
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
		logoutRedirectURL: bindings.BASE_URL!,
	});

export const getKindeClient: MiddlewareHandler<{
	Bindings: KindeBindings;
	Variables: Variables;
}> = async (c, next) => {
	if (!c.var.kindeClient) {
		const kindeClient = initKindeClient(c.env);

		c.set("kindeClient", kindeClient);
	}

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

export const ensureUser: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	try {
		const manager = sessionManager(c);
		const isAuthenticated = await c.var.kindeClient.isAuthenticated(manager);

		if (!isAuthenticated) {
			throw unauthorizedRequestException();
		}

		// While checking if a user is authenticated, we can also check if the user is already stored in the context.
		if (!c.var.user) {
			const profile = await c.var.kindeClient.getUserProfile(manager);
			const currentOrg = await c.var.kindeClient.getOrganization(manager);
			const permissions = await c.var.kindeClient.getPermissions(manager);

			c.set("user", {
				...profile,
				current_org: currentOrg.orgCode,
				permissions: permissions.permissions,
			});
		}

		await next();
	} catch (error) {
		throw unknownRequestException(error);
	}
};

export const ensureOrgAssociation: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	const orgId = c.req.param("orgId");

	if (orgId !== c.var.user.current_org) {
		throw unauthorizedRequestException();
	}

	await next();
};

export const ensureOrgAdmin: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	const user = c.var.user;

	if (!user.permissions.includes(MANAGE_ORG)) {
		throw forbiddenRequestException();
	}

	await next();
};

export const getRoles: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	try {
		if (!c.var.roles) {
			const orgRoles = await Roles.getRoles();

			c.set("roles", orgRoles.roles || []);
		}

		await next();
	} catch (error) {
		throw unknownRequestException(error);
	}
};

export const refreshUser = async ({
	userId,
	kindeClient,
	manager,
}: {
	kindeClient: ReturnType<typeof initKindeClient>;
	manager: SessionManager;
	userId: string;
}) => {
	try {
		/*
			User orgs are retrieved from the user's claims. To update the org name in the
			user's claims, we need to refresh the user's claims.
		*/
		await Users.refreshUserClaims({
			userId,
		});

		/* Refresh the user's tokens to ensure that the user's claims are up-to-date */
		await kindeClient.refreshTokens(manager);
	} catch (error) {
		throw unknownRequestException(error);
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
