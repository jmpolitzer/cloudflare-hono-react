import { createOrgsRoutes } from "@/server/routes/orgs";
import { errorHandler } from "@/server/utils/errors";
import { DEFAULT_EMAIL_SENDER } from "@/shared/constants";
import type {
	CancelablePromise,
	search_users_response,
} from "@kinde/management-api-js";
import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
	mockRegisterUserToOrg,
	mockResendClient,
	mockRoles,
	mockSearch,
	mockUnauthorizedError,
	mockUsers,
	mockZodError,
} from "../vitest-setup";
import type { MockKindeClientOptions } from "../vitest-setup";

describe("Orgs API Tests", () => {
	// Helper to create app with configurable auth options
	const setupApp = (orgsOptions?: MockKindeClientOptions) => {
		const orgs = createOrgsRoutes({
			getKindeClient: mockGetKindeClient(orgsOptions),
			ensureUser: mockEnsureUser,
			ensureOrgAdmin: mockEnsureOrgAdmin,
			ensureOrgAssociation: mockEnsureOrgAssociation,
			initKindeApi: mockInitKindeApi,
			getRoles: mockGetRoles,
			refreshUser: mockRefreshUser,
			initResendEmailer: mockInitResendEmailer,
			registerUserToOrg: mockRegisterUserToOrg,
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

	beforeEach(() => {
		// Reset state by clearing and re-initializing via mockOrganizations methods
		vi.restoreAllMocks();
		mockOrganizations.removeUser("mock-org", "other-user-id"); // Ensure clean slate
		mockOrganizations.addUser("mock-org", {
			id: "mock-user-id",
			email: "mockuser@example.com",
		});
	});

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

	it("PATCH /api/orgs/:orgId - should fail with invalid form data", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				permissions: ["manage:org"],
				orgCode: "mock-org",
			},
		});
		const formData = new FormData();
		formData.append("name", ""); // Invalid: empty name

		const response = await app.request(
			"/api/orgs/mock-org",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();
		expect(response.status).toBe(400);
		expect(data).toMatchObject(mockZodError("Name is required"));
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

	it("POST /api/orgs/:orgId/invite - should invite new user", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("email", "newuser@example.com");
		formData.append("firstName", "New");
		formData.append("lastName", "User");
		formData.append("orgId", "mock-org");
		formData.append("orgName", "Mock Org");

		const response = await app.request(
			"/api/orgs/mock-org/invite",
			{ method: "POST", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
		expect(mockUsers.createUser).toHaveBeenCalled();
		expect(mockOrganizations.addOrganizationUsers).toHaveBeenCalledWith({
			orgCode: "mock-org",
			requestBody: {
				users: [
					{
						id: "new-user-id",
						roles: ["basic"],
					},
				],
			},
		});
		expect(mockResendClient.emails.send).toHaveBeenCalledWith(
			expect.objectContaining({
				from: DEFAULT_EMAIL_SENDER,
				to: ["newuser@example.com"],
				subject: "You have been invited to join Mock Org",
			}),
		);
	});

	it("POST /api/orgs/:orgId/invite - should invite existing user", async () => {
		mockSearch.searchUsers = vi.fn(async ({ query }) => ({
			results: [{ id: "existing-user-id", email: query }],
		})) as unknown as (data: {
			query: string;
		}) => CancelablePromise<search_users_response>;

		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("email", "existinguser@example.com");
		formData.append("firstName", "Existing");
		formData.append("lastName", "User");
		formData.append("orgId", "mock-org");
		formData.append("orgName", "Mock Org");

		const response = await app.request(
			"/api/orgs/mock-org/invite",
			{ method: "POST", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
		expect(mockOrganizations.addOrganizationUsers).toHaveBeenCalledWith({
			orgCode: "mock-org",
			requestBody: { users: [{ id: "existing-user-id", roles: ["basic"] }] },
		});
		expect(mockResendClient.emails.send).toHaveBeenCalledWith(
			expect.objectContaining({
				from: DEFAULT_EMAIL_SENDER,
				to: ["existinguser@example.com"],
				subject: "You have been invited to join Mock Org",
			}),
		);
		expect(mockUsers.createUser).not.toHaveBeenCalled();
	});

	it("POST /api/orgs/:orgId/invite - should fail with invalid form data", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("email", "invalid-email"); // Invalid email
		formData.append("firstName", ""); // Missing firstName
		formData.append("lastName", "User");
		formData.append("orgId", "mock-org");
		formData.append("orgName", "Mock Org");

		const response = await app.request(
			"/api/orgs/mock-org/invite",
			{ method: "POST", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toMatchObject(
			mockZodError("This is not a valid email,\nFirst name is required"),
		);
	});

	it("POST /api/orgs/:orgId/invite - should fail if user not associated with org", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "other-org",
				permissions: ["manage:org"],
			}, // Different orgCode
		});
		const formData = new FormData();
		formData.append("email", "newuser@example.com");
		formData.append("firstName", "New");
		formData.append("lastName", "User");

		const response = await app.request(
			"/api/orgs/mock-org/invite",
			{ method: "POST", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toMatchObject(mockUnauthorizedError);
	});

	it("POST /api/orgs/:orgId/invite - should fail if user not admin", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", orgCode: "mock-org", permissions: [] }, // No manage:org
		});
		const formData = new FormData();
		formData.append("email", "newuser@example.com");
		formData.append("firstName", "New");
		formData.append("lastName", "User");

		const response = await app.request(
			"/api/orgs/mock-org/invite",
			{ method: "POST", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(403);
		expect(data).toMatchObject(mockForbiddenError);
	});

	it("DELETE /api/orgs/:orgId/users/:userId/roles/:roleName - should remove user role and user", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles/basic",
			{ method: "DELETE" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
		expect(mockOrganizations.deleteOrganizationUserRole).toHaveBeenCalledWith({
			orgCode: "mock-org",
			userId: "target-user-id",
			roleId: "basic",
		});
		expect(mockOrganizations.removeOrganizationUser).toHaveBeenCalledWith({
			orgCode: "mock-org",
			userId: "target-user-id",
		});
	});

	it("DELETE /api/orgs/:orgId/users/:userId/roles/:roleName - should fail if role not found", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles/unknown",
			{ method: "DELETE" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(500);
		expect(data).toMatchObject({
			success: false,
			error: { message: "", code: "InternalServerError" },
		});
		expect(mockOrganizations.deleteOrganizationUserRole).not.toHaveBeenCalled();
		expect(mockOrganizations.removeOrganizationUser).not.toHaveBeenCalled();
	});

	it("DELETE /api/orgs/:orgId/users/:userId/roles/:roleName - should fail if user not associated with org", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "other-org",
				permissions: ["manage:org"],
			},
		});

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles/basic",
			{ method: "DELETE" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toMatchObject(mockUnauthorizedError);
	});

	// Failure: User Not Admin
	it("DELETE /api/orgs/:orgId/users/:userId/roles/:roleName - should fail if user not admin", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", orgCode: "mock-org", permissions: [] },
		});

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles/basic",
			{ method: "DELETE" },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(403);
		expect(data).toMatchObject(mockForbiddenError);
	});

	it("PATCH /api/orgs/:orgId/users/:userId/roles - should update user role", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("currentRoleId", "basic");
		formData.append("newRoleId", "admin");

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
		expect(mockOrganizations.createOrganizationUserRole).toHaveBeenCalledWith({
			orgCode: "mock-org",
			userId: "target-user-id",
			requestBody: { role_id: "admin" },
		});
		expect(mockOrganizations.deleteOrganizationUserRole).toHaveBeenCalledWith({
			orgCode: "mock-org",
			userId: "target-user-id",
			roleId: "basic",
		});
	});

	it("PATCH /api/orgs/:orgId/users/:userId/roles - should fail with invalid form data", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("currentRoleId", "basic");
		// Missing newRoleId

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toMatchObject(mockZodError("Required"));
	});

	it("PATCH /api/orgs/:orgId/users/:userId/roles - should fail if role not found", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("currentRoleId", "basic");
		formData.append("newRoleId", "unknown");

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toMatchObject(
			mockZodError(
				"Invalid enum value. Expected 'admin' | 'basic', received 'unknown'",
			),
		);
		expect(mockOrganizations.createOrganizationUserRole).not.toHaveBeenCalled();
		expect(mockOrganizations.deleteOrganizationUserRole).not.toHaveBeenCalled();
	});

	it("PATCH /api/orgs/:orgId/users/:userId/roles - should fail if user not associated with org", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "other-org",
				permissions: ["manage:org"],
			},
		});
		const formData = new FormData();
		formData.append("currentRoleId", "basic");
		formData.append("newRoleId", "Admin");

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(401);
		expect(data).toMatchObject(mockUnauthorizedError);
	});

	it("PATCH /api/orgs/:orgId/users/:userId/roles - should fail if user not admin", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: { id: "mock-user-id", orgCode: "mock-org", permissions: [] },
		});
		const formData = new FormData();
		formData.append("currentRoleId", "basic");
		formData.append("newRoleId", "Admin");

		const response = await app.request(
			"/api/orgs/mock-org/users/target-user-id/roles",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(403);
		expect(data).toMatchObject(mockForbiddenError);
	});
});
