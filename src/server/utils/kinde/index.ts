import {
	GrantType,
	createKindeServerClient,
} from "@kinde-oss/kinde-typescript-sdk";
import {
	Organizations,
	Roles,
	Users,
	init as initKindeManagementApi,
} from "@kinde/management-api-js";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import type {
	ResendBindings,
	ResendVariables,
} from "@/server/utils/email/resend";
import {
	forbiddenRequestException,
	unauthorizedRequestException,
	unknownRequestException,
} from "@/server/utils/errors";
import { MANAGE_ORG } from "@/shared/constants";
import type { SessionManager, UserType } from "@kinde-oss/kinde-typescript-sdk";
import type { Search, get_roles_response } from "@kinde/management-api-js";
import type { Context, MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { CookieOptions } from "hono/utils/cookie";

export interface Variables {
	kindeClient: ReturnType<typeof initKindeClient>;
	roles: get_roles_response["roles"];
	user: UserType & { currentOrg: string | null } & { permissions: string[] };
}

export interface KindeBindings {
	BASE_URL: string;
	KINDE_AUTH_DOMAIN: string;
	KINDE_CLIENT_ID: string;
	KINDE_CLIENT_SECRET: string;
	KINDE_M2M_ID: string;
	KINDE_M2M_SECRET: string;
	KINDE_CONNECTION_ID: string;
}

export interface KindeRouteBindings {
	ensureUser?: MiddlewareHandler<{ Variables: Variables }>;
	ensureOrgAssociation?: MiddlewareHandler<{ Variables: Variables }>;
	ensureOrgAdmin?: MiddlewareHandler<{ Variables: Variables }>;
	getKindeClient?: MiddlewareHandler<{
		Bindings: KindeBindings;
		Variables: Variables;
	}>;
	getRoles?: MiddlewareHandler<{ Variables: Variables }>;
	initKindeApi?: MiddlewareHandler<{
		Bindings: KindeBindings;
		Variables: Variables;
	}>;
	refreshUser?: (args: {
		userId: string;
		kindeClient: ReturnType<typeof initKindeClient>;
		manager: SessionManager;
	}) => Promise<void>;
	initResendEmailer?: MiddlewareHandler<{
		Bindings: ResendBindings;
		Variables: ResendVariables;
	}>;
	registerUserToOrg?: (args: {
		orgId: string;
		role: "admin" | "basic";
		user:
			| {
					email: string;
					firstName: string;
					lastName: string;
			  }
			| string;
	}) => Promise<void>;
	Organizations?: typeof Organizations;
	Roles?: typeof Roles;
	Search?: typeof Search;
	Users?: typeof Users;
}

const initKindeClient = (bindings: KindeBindings) =>
	createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		authDomain: bindings.KINDE_AUTH_DOMAIN!,
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		clientId: bindings.KINDE_CLIENT_ID!,
		clientSecret: bindings.KINDE_CLIENT_SECRET,
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		redirectURL: `${bindings.BASE_URL!}/api/auth/callback`,
		// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
		logoutRedirectURL: `${bindings.BASE_URL!}/login`,
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
				currentOrg: currentOrg.orgCode,
				permissions: permissions.permissions,
			});
		}

		await next();
	} catch (error) {
		if (error instanceof HTTPException) {
			throw error;
		}

		throw unknownRequestException(error);
	}
};

export const ensureOrgAssociation: MiddlewareHandler<{
	Variables: Variables;
}> = async (c, next) => {
	const orgId = c.req.param("orgId");

	if (orgId !== c.var.user.currentOrg) {
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

export const registerUserToOrg = async ({
	orgId,
	role,
	user,
}: {
	orgId: string;
	role: "admin" | "basic";
	user: { email: string; firstName: string; lastName: string } | string;
}) => {
	try {
		let userId: string | undefined;

		if (typeof user === "string") {
			userId = user;
		} else {
			/* Create User */
			const newUser = await Users.createUser({
				requestBody: {
					profile: {
						given_name: user.firstName,
						family_name: user.lastName,
					},
					identities: [
						{
							type: "email",
							details: {
								email: user.email,
							},
						},
					],
				},
			});

			userId = newUser.id;
		}

		/* Add user to organization with role. */
		await Organizations.addOrganizationUsers({
			orgCode: orgId,
			requestBody: {
				users: [
					{
						id: userId,
						roles: [role],
					},
				],
			},
		});

		return;
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
