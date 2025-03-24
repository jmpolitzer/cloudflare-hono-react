import type { KindeBindings, Variables } from "@/server/utils/kinde"; // Adjust path if needed
import type {
	CreateOrgURLOptions,
	FlagType,
	GetFlagType,
	LoginURLOptions,
	OAuth2CodeExchangeResponse,
	RegisterURLOptions,
	SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import type { Context, Next } from "hono";
import { mockUser } from "./mocks";

// Mock Kinde client interface matching the real kindeClient
interface MockKindeClient {
	login(
		sessionManager: SessionManager,
		options?: LoginURLOptions,
	): Promise<URL>;
	logout(sessionManager: SessionManager): Promise<URL>;
	register(
		sessionManager: SessionManager,
		options?: RegisterURLOptions,
	): Promise<URL>;
	createOrg(
		sessionManager: SessionManager,
		options?: CreateOrgURLOptions,
	): Promise<URL>;
	getToken(sessionManager: SessionManager): Promise<string>;
	refreshTokens(
		sessionManager: SessionManager,
	): Promise<OAuth2CodeExchangeResponse>;
	getUser(sessionManager: SessionManager): Promise<{
		id: string;
		given_name: string | null;
		family_name: string | null;
		email: string | null;
		picture: string | null;
	}>;
	isAuthenticated(sessionManager: SessionManager): Promise<boolean>;
	getUserProfile(sessionManager: SessionManager): Promise<{
		id: string;
		given_name: string | null;
		family_name: string | null;
		email: string | null;
		picture: string | null;
	}>;
	getOrganization(
		sessionManager: SessionManager,
	): Promise<{ orgCode: string | null }>;
	getPermissions(
		sessionManager: SessionManager,
	): Promise<{ orgCode: string | null; permissions: string[] }>;
	getUserOrganizations(
		sessionManager: SessionManager,
	): Promise<{ orgCodes: string[] }>;
	handleRedirectToApp(
		sessionManager: SessionManager,
		callbackURL: URL,
	): Promise<void>;
	getClaim(
		sessionManager: SessionManager,
		claim: string,
		tokenType?: string,
	): { name: string; value: unknown };
	getFlag: (
		sessionManager: SessionManager,
		code: string,
		defaultValue?: string | number | boolean | undefined,
		type?: keyof FlagType | undefined,
	) => Promise<GetFlagType>;
	getBooleanFlag(
		sessionManager: SessionManager,
		code: string,
		defaultValue?: boolean,
	): boolean;
	getStringFlag(
		sessionManager: SessionManager,
		code: string,
		defaultValue?: string,
	): string;
	getIntegerFlag(
		sessionManager: SessionManager,
		code: string,
		defaultValue?: number,
	): number;
	getPermission(
		sessionManager: SessionManager,
		key: string,
	): { orgCode: string | null; isGranted: boolean };
	getClaimValue(
		sessionManager: SessionManager,
		claim: string,
		tokenType?: string,
	): string | null;
}

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

// Mock Kinde client factory
const initMockKindeClient = () => ({
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
	getUser: async (sessionManager: SessionManager) => mockUser,
	isAuthenticated: async (sessionManager: SessionManager) => true,
	getUserProfile: async (sessionManager: SessionManager) => ({
		id: "mock-user-id",
		email: "mockuser@example.com",
		given_name: "Mock",
		family_name: "User",
		picture: "mock-picture",
	}),
	getOrganization: async (sessionManager: SessionManager) => ({
		orgCode: "mock-org",
	}),
	getPermissions: async (sessionManager: SessionManager) => ({
		orgCode: "mock-org",
		permissions: ["manage:org"],
	}),
	getUserOrganizations: async (sessionManager: SessionManager) => ({
		orgCodes: ["mock-org", "mock-org-1"],
	}),
	handleRedirectToApp: async (
		sessionManager: SessionManager,
		callbackURL: URL,
	) => undefined,
	getClaim: async (
		sessionManager: SessionManager,
		claim: string,
		tokenType?: string,
	) => ({ name: "mock-claim", value: "mock-claim-value" }), // Simplified return
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
		orgCode: "mock-org",
		isGranted: true,
	}),
	getClaimValue: async (
		sessionManager: SessionManager,
		claim: string,
		tokenType?: string,
	) => "mock-claim-value",
});

// Mock getKindeClient middleware
export const mockGetKindeClient = async (
	c: Context<{ Bindings: KindeBindings; Variables: Variables }>,
	next: Next,
) => {
	if (!c.var.kindeClient) {
		c.set("kindeClient", initMockKindeClient());
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
		throw new Error("Unauthorized"); // Matches unauthorizedRequestException
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
		throw new Error("Unauthorized"); // Matches unauthorizedRequestException
	}
	await next();
};

// Mock ensureOrgAdmin middleware
export const mockEnsureOrgAdmin = async (
	c: Context<{ Variables: Variables }>,
	next: Next,
) => {
	if (!c.var.user.permissions.includes("manage:org")) {
		throw new Error("Forbidden"); // Matches forbiddenRequestException
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
			{ key: "admin", name: "Admin" },
			{ key: "user", name: "User" },
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
	kindeClient: MockKindeClient;
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

// Mock Roles and Users from management API (for completeness)
export const mockRoles = {
	getRoles: async () => ({
		roles: [
			{ key: "admin", name: "Admin" },
			{ key: "user", name: "User" },
		],
	}),
};

export const mockUsers = {
	refreshUserClaims: async ({ userId }: { userId: string }) => undefined,
};
