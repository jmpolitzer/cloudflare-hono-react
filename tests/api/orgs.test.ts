import { createOrgsRoutes } from "@/server/routes/orgs";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import {
	mockEnsureOrgAdmin,
	mockEnsureOrgAssociation,
	mockEnsureUser,
	mockForbiddenError,
	mockGetKindeClient,
	mockGetRoles,
	mockInitKindeApi,
	mockInitResendEmailer,
	mockKindeBindings,
	mockOrganizations,
	mockRefreshUser,
	mockRoles,
	mockSearch,
	mockUnauthorizedError,
	mockUsers,
} from "../setup";
import type { MockKindeClientOptions } from "../setup";

describe("Orgs API Tests", () => {
	// Helper to create app with configurable auth options
	const setupApp = (authOptions?: MockKindeClientOptions) => {
		const orgs = createOrgsRoutes({
			getKindeClient: mockGetKindeClient(authOptions),
			ensureUser: mockEnsureUser,
			ensureOrgAdmin: mockEnsureOrgAdmin,
			ensureOrgAssociation: mockEnsureOrgAssociation,
			initKindeApi: mockInitKindeApi,
			getRoles: mockGetRoles,
			refreshUser: mockRefreshUser,
			initResendEmailer: mockInitResendEmailer,
			Organizations: mockOrganizations,
			Roles: mockRoles,
			Search: mockSearch,
			Users: mockUsers,
		});
		return new Hono()
			.basePath("/api")
			.route("/orgs", orgs)
			.onError(errorHandler);
	};

	/* Test PATCH /:orgId (Edit Organization) */
	it("PATCH /api/orgs/:orgId - should update organization (authenticated admin)", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				permissions: ["manage:org"],
				orgCode: "mock-org",
			},
		});

		const initialOrg = await mockOrganizations.getOrganization({
			code: "mock-org",
		});
		const initialName = initialOrg.name;

		const formData = new FormData();
		formData.append("name", "Updated Org");

		const response = await app.request(
			"/api/orgs/mock-org",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });

		const updatedOrg = await mockOrganizations.getOrganization({
			code: "mock-org",
		});
		expect(updatedOrg.name).toBe("Updated Org");
		expect(updatedOrg.name).not.toBe(initialName);
	});

	it("PATCH /api/orgs/:orgId - should fail if unauthenticated", async () => {
		const app = setupApp({ isAuthenticated: false });

		const formData = new FormData();
		formData.append("name", "Updated Org");

		const response = await app.request(
			"/api/orgs/mock-org",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toMatchObject(mockUnauthorizedError);
	});

	it("PATCH /api/orgs/:orgId - should fail if not org admin", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", permissions: [], orgCode: "mock-org" },
		});

		const formData = new FormData();
		formData.append("name", "Updated Org");

		const response = await app.request(
			"/api/orgs/mock-org",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(403);
		expect(data).toMatchObject(mockForbiddenError);
	});

	it("PATCH /api/orgs/:orgId - should fail if not in org", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				permissions: ["manage:org"],
				orgCode: "other-org",
			},
		});

		const formData = new FormData();
		formData.append("name", "Updated Org");

		const response = await app.request(
			"/api/orgs/mock-org",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toMatchObject(mockUnauthorizedError);
	});

	/* Test GET /:orgId/users (Get Organization Users) */
	it("GET /api/orgs/:orgId/users - should return org users (authenticated admin)", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				permissions: ["manage:org"],
				orgCode: "mock-org",
			},
		});

		const response = await app.request(
			"/api/orgs/mock-org/users",
			{ method: "GET" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({
			success: true,
			users: {
				organization_users: [
					{ id: "mock-user-id", email: "mockuser@example.com" },
				],
			},
		});
	});

	it("GET /api/orgs/:orgId/users - should fail if not admin", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", permissions: [], orgCode: "mock-org" },
		});

		const response = await app.request(
			"/api/orgs/mock-org/users",
			{ method: "GET" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(403);
		expect(data).toMatchObject(mockForbiddenError);
	});

	/* Test POST /:orgId/activate (Activate Admin Role) */
	it("POST /api/orgs/:orgId/activate - should assign admin role (authenticated user in org)", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", permissions: [], orgCode: "mock-org" },
		});

		const response = await app.request(
			"/api/orgs/mock-org/activate",
			{ method: "POST" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
	});

	it("POST /api/orgs/:orgId/activate - should fail if not in org", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", permissions: [], orgCode: "other-org" },
		});

		const response = await app.request(
			"/api/orgs/mock-org/activate",
			{ method: "POST" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toMatchObject(mockUnauthorizedError);
	});
});
