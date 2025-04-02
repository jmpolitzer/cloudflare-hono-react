import { applyD1Migrations, env } from "cloudflare:test";
import type {
	ResendBindings,
	ResendVariables,
} from "@/server/utils/email/resend";
import {
	forbiddenRequestException,
	unauthorizedRequestException,
} from "@/server/utils/errors";
import type { KindeBindings, Variables } from "@/server/utils/kinde";
import type {
	ClaimTokenType,
	CreateOrgURLOptions,
	FlagType,
	GetFlagType,
	LoginURLOptions,
	RegisterURLOptions,
	SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import type {
	GetOrganizationData,
	GetOrganizationUsersData,
	Organizations,
	Roles,
	Search,
	Users,
	get_organization_response,
} from "@kinde/management-api-js";
import type { Context, Next } from "hono";
import type { Resend } from "resend";
import { vi } from "vitest";
import { mockAdminUser } from "./mocks";

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);

// Mocked environment bindings
export const mockKindeBindings: KindeBindings = {
	BASE_URL: "http://localhost:8787",
	KINDE_AUTH_DOMAIN: "https://mock.kinde.com",
	KINDE_CLIENT_ID: "mock-client-id",
	KINDE_CLIENT_SECRET: "mock-client-secret",
	KINDE_REDIRECT_URL: "http://localhost:8787/auth/callback",
	KINDE_M2M_ID: "mock-m2m-id",
	KINDE_M2M_SECRET: "mock-m2m-secret",
};

export interface MockKindeClientOptions {
	isAuthenticated?: boolean;
	user?: {
		id: string;
		email?: string | null;
		given_name?: string | null;
		family_name?: string | null;
		picture?: string | null;
		permissions?: string[]; // Add permissions for role testing
		orgCode?: string | null; // Current org
	};
}

// Mock Kinde client factory
const initMockKindeClient = (options: MockKindeClientOptions = {}) => {
	const defaults: MockKindeClientOptions = {
		isAuthenticated: true,
		user: mockAdminUser,
	};
	const config = {
		...defaults,
		...options,
		user: { ...defaults.user, ...options.user },
	};

	return {
		login: async (sessionManager: SessionManager, options?: LoginURLOptions) =>
			new URL("http://localhost:8787/auth/callback"),
		logout: async (sessionManager: SessionManager) =>
			new URL("http://localhost:8787/"),
		register: async (
			sessionManager: SessionManager,
			options?: RegisterURLOptions,
		) => new URL("http://localhost:8787/auth/callback"),
		createOrg: async (
			sessionManager: SessionManager,
			options?: CreateOrgURLOptions,
		) => new URL("http://localhost:8787/auth/callback"),
		getToken: async (sessionManager: SessionManager) => "mock-access-token",
		refreshTokens: async (sessionManager: SessionManager) => ({
			access_token: "mock-access-token",
			expires_in: "3600",
			token_type: "Bearer",
			refresh_token: "mock-refresh-token",
			id_token: "mock-id-token",
			scope: "openid profile email",
		}),
		getUser: async (sessionManager: SessionManager) => ({
			id: config.user?.id ?? "mock-user-id",
			email: config.user?.email ?? "",
			given_name: config.user?.given_name ?? "",
			family_name: config.user?.family_name ?? "",
			picture: config.user?.picture ?? null,
		}),
		isAuthenticated: async (sessionManager: SessionManager) =>
			config.isAuthenticated ?? false,
		getUserProfile: async (sessionManager: SessionManager) => ({
			id: config.user?.id ?? "mock-user-id",
			email: config.user?.email ?? "",
			given_name: config.user?.given_name ?? "",
			family_name: config.user?.family_name ?? "",
			picture: config.user?.picture ?? null,
		}),
		getOrganization: async (sessionManager: SessionManager) => ({
			orgCode: config.user?.orgCode ?? null,
		}),
		getPermissions: async (sessionManager: SessionManager) => ({
			permissions: config.user?.permissions ?? [],
			orgCode: config.user?.orgCode ?? null,
		}),
		getUserOrganizations: async (sessionManager: SessionManager) => ({
			orgCodes: config.user?.orgCode ? [config.user.orgCode] : [],
		}),
		handleRedirectToApp: async (
			sessionManager: SessionManager,
			callbackURL: URL,
		): Promise<void> => undefined,
		getClaim: async (
			sessionManager: SessionManager,
			claim: string,
			type?: ClaimTokenType,
		) => ({ name: "mock-claim", value: "mock-claim-value" as unknown }), // Simplified return
		getFlag: async (
			sessionManager: SessionManager,
			code: string,
			defaultValue?: string | number | boolean | undefined,
			type?: keyof FlagType | undefined,
		) =>
			({
				value: defaultValue ?? "mock-flag",
				is_default: defaultValue === undefined,
			}) as GetFlagType,
		getBooleanFlag: async (
			sessionManager: SessionManager,
			code: string,
			defaultValue?: boolean,
		) => defaultValue ?? true,
		getStringFlag: async (
			sessionManager: SessionManager,
			code: string,
			defaultValue?: string,
		) => defaultValue ?? "mock-string",
		getIntegerFlag: async (
			sessionManager: SessionManager,
			code: string,
			defaultValue?: number,
		) => defaultValue ?? 42,
		getPermission: async (sessionManager: SessionManager, key: string) => ({
			orgCode: config.user?.orgCode ?? null,
			isGranted: config.user?.permissions?.includes(key) ?? false,
		}),
		getClaimValue: async (
			sessionManager: SessionManager,
			claim: string,
			tokenType?: ClaimTokenType,
		) => "mock-claim-value" as unknown,
	};
};

// Mock getKindeClient middleware
export const mockGetKindeClient =
	(options?: MockKindeClientOptions) =>
	async (
		c: Context<{ Bindings: KindeBindings; Variables: Variables }>,
		next: Next,
	) => {
		if (!c.var.kindeClient) {
			c.set("kindeClient", initMockKindeClient(options));
		}
		await next();
	};

// Mock initKindeApi middleware (simulates management API initialization)
export const mockInitKindeApi = async (
	c: Context<{ Bindings: KindeBindings; Variables: Variables }>,
	next: Next,
) => {
	// No-op for mock, since we mock Roles.getRoles separately
	await next();
};

// Mock ensureUser middleware
export const mockEnsureUser = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const manager = mockSessionManager(c);
	const isAuthenticated = await c.var.kindeClient.isAuthenticated(manager);

	if (!isAuthenticated) {
		throw unauthorizedRequestException();
	}

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
};

// Mock ensureOrgAssociation middleware
export const mockEnsureOrgAssociation = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	const orgId = c.req.param("orgId") || "mock-org"; // Default to mock-org
	if (orgId !== c.var.user.currentOrg) {
		throw unauthorizedRequestException();
	}
	await next();
};

// Mock ensureOrgAdmin middleware
export const mockEnsureOrgAdmin = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	if (!c.var.user.permissions.includes("manage:org")) {
		throw forbiddenRequestException();
	}
	await next();
};

// Mock getRoles middleware
export const mockGetRoles = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	if (!c.var.roles) {
		c.set("roles", [
			{ id: "admin", key: "admin", name: "admin" },
			{ id: "basic", key: "basic", name: "basic" },
		]);
	}
	await next();
};

// Mock refreshUser function
export const mockRefreshUser = async ({
	userId,
	kindeClient,
	manager,
}: {
	userId: string;
	kindeClient: ReturnType<typeof initMockKindeClient>;
	manager: SessionManager;
}) => {
	// Simulate refreshing tokens and claims (no-op in mock)
};

// Mock sessionManager
export const mockSessionManager = (c: Context): SessionManager => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const store: Record<string, any> = {
		id_token: "mock-id-token",
		access_token: "mock-access-token",
	};

	return {
		async getSessionItem(key: string) {
			return store[key] || null;
		},
		async setSessionItem(key: string, value: unknown) {
			store[key] = typeof value === "string" ? value : JSON.stringify(value);
		},
		async removeSessionItem(key: string) {
			delete store[key];
		},
		async destroySession() {
			// biome-ignore lint/complexity/noForEach: <explanation>
			Object.keys(store).forEach((key) => delete store[key]);
		},
	};
};

// Mock organization state with users
const mockOrgState: Record<
	string,
	{
		name?: string;
		users: { id: string; email: string }[];
		[key: string]:
			| string
			| number
			| boolean
			| undefined
			| { id: string; email: string }[];
	}
> = {
	"mock-org": {
		name: "Original Org",
		users: [{ id: "mock-user-id", email: "mockuser@example.com" }], // Initial user
	},
};

// Mock Organizations with dynamic state
export const mockOrganizations = {
	updateOrganization: vi.fn(async ({ orgCode, requestBody }) => {
		mockOrgState[orgCode] = { ...mockOrgState[orgCode], ...requestBody };
		return { success: true };
	}),
	getOrganizationUsers: vi.fn(async ({ orgCode }: GetOrganizationUsersData) => {
		const org = mockOrgState[orgCode] || { users: [] };
		return { organization_users: org.users };
	}),
	getOrganizationUserRoles: vi.fn(async ({ orgCode, userId }) => ({
		roles: [],
	})),
	createOrganizationUserRole: vi.fn(
		async ({ orgCode, userId, requestBody }) => ({
			success: true,
		}),
	),
	addOrganizationUsers: vi.fn(async ({ orgCode, requestBody }) => {
		const org = mockOrgState[orgCode] || { users: [] };
		// biome-ignore lint/complexity/noForEach: <explanation>
		requestBody.users.forEach((user: { id: string }) => {
			if (!org.users.some((u) => u.id === user.id)) {
				org.users.push({ id: user.id, email: `${user.id}@example.com` });
			}
		});
		mockOrgState[orgCode] = org;
		return { success: true };
	}),
	removeOrganizationUser: vi.fn(async ({ orgCode, userId }) => {
		const org = mockOrgState[orgCode];
		if (org) {
			org.users = org.users.filter((u) => u.id !== userId);
			mockOrgState[orgCode] = org;
		}
		return { success: true };
	}),
	deleteOrganizationUserRole: vi.fn(async ({ orgCode, userId, roleId }) => ({
		success: true,
	})),
	getOrganization: vi.fn(
		async ({
			code,
		}: GetOrganizationData): Promise<get_organization_response> => {
			return mockOrgState[code || ""] || { name: "" };
		},
	),
	// Helper methods to manipulate state
	addUser: (orgCode: string, user: { id: string; email: string }) => {
		const org = mockOrgState[orgCode] || { name: orgCode, users: [] };
		if (!org.users.some((u) => u.id === user.id)) {
			org.users.push(user);
		}
		mockOrgState[orgCode] = org;
	},
	removeUser: (orgCode: string, userId: string) => {
		const org = mockOrgState[orgCode];
		if (org) {
			org.users = org.users.filter((u) => u.id !== userId);
			mockOrgState[orgCode] = org;
		}
	},
} as unknown as typeof Organizations & {
	addUser: (orgCode: string, user: { id: string; email: string }) => void;
	removeUser: (orgCode: string, userId: string) => void;
};

// Mock Roles from management API
export const mockRoles = {
	getRoles: async () => ({
		roles: [
			{ key: "admin", name: "Admin" },
			{ key: "user", name: "User" },
		],
	}),
} as unknown as typeof Roles;

// Mock Users from management API
export const mockUsers = {
	createUser: vi.fn(async ({ requestBody }) => ({
		id: "new-user-id",
		email: requestBody.identities[0].details.email,
	})),
	refreshUserClaims: async ({ userId }: { userId: string }) => undefined,
} as unknown as typeof Users;

// Mock Search API
export const mockSearch = {
	searchUsers: async ({ query }: { query: string }) => ({
		results: [],
	}),
} as unknown as typeof Search;

// Mock Resend emailer
export const mockResendClient = {
	emails: {
		send: async ({
			from = "no-reply@yourdomain.com",
			to,
			subject,
			html,
			text,
			cc,
			bcc,
			replyTo,
			headers,
		}: {
			from?: string;
			to: string | string[];
			subject: string;
			html?: string;
			text?: string;
			cc?: string | string[];
			bcc?: string | string[];
			replyTo?: string | string[];
			headers?: Record<string, string>;
		}) => {
			return {
				data: {
					id: `mock-email-id-${Math.random().toString(36).substring(2)}`,
					from,
					to: Array.isArray(to) ? to : [to],
					created_at: new Date().toISOString(),
				},
				error: null,
			};
		},
	},
} as unknown as Resend;

// Mock initResendEmailer
export const mockInitResendEmailer = async (
	c: Context<{
		Bindings: ResendBindings;
		Variables: ResendVariables;
	}>,
	next: Next,
) => {
	c.set("resendClient", mockResendClient);
	await next();
};

export const mockNotFoundError = {
	success: false,
	error: { code: "NotFound", message: "" },
};

export const mockBadRequestError = {
	success: false,
	error: { code: "BadRequest", message: "" },
};

export const mockForbiddenError = {
	success: false,
	error: { code: "Forbidden", message: "" },
};

export const mockUnauthorizedError = {
	success: false,
	error: { code: "Unauthorized", message: "" },
};

export const mockZodError = (message: string) => ({
	success: false,
	error: { code: "BadRequest", message },
});
