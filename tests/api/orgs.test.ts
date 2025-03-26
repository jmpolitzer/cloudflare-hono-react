import { createOrgsRoutes } from "@/server/routes/orgs";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import {
	mockEnsureOrgAdmin,
	mockEnsureOrgAssociation,
	mockEnsureUser,
	mockGetKindeClient,
	mockGetRoles,
	mockInitKindeApi,
	mockInitResendEmailer,
	mockKindeBindings,
	mockOrganizations,
	mockRefreshUser,
	mockRoles,
	mockSearch,
	mockUsers,
} from "../setup";

describe("Orgs API Tests", () => {
	const orgs = createOrgsRoutes({
		getKindeClient: mockGetKindeClient,
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
	const app = new Hono()
		.basePath("/api")
		.route("/orgs", orgs)
		.onError(errorHandler);

	/* Test PATCH /:orgId (Edit Organization) */
	it("PATCH /api/orgs/:orgId - should update organization", async () => {
		// Step 1: Get initial state (optional, for explicit verification)
		const initialOrg = await mockOrganizations.getOrganization({
			code: "mock-org",
		});
		const initialName = initialOrg.name;
		// Step 2: Perform the PATCH request
		const formData = new FormData();
		formData.append("name", "Updated Org");

		const response = await app.request(
			"/api/orgs/mock-org",
			{
				method: "PATCH",
				body: formData,
			},
			mockKindeBindings,
		);
		const data = await response.json();

		// Step 3: Verify response
		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });

		// Step 4: Verify the data changed
		const updatedOrg = await mockOrganizations.getOrganization({
			code: "mock-org",
		});
		expect(updatedOrg.name).toBe("Updated Org");
		expect(updatedOrg.name).not.toBe(initialName); // Ensure it changed
	});

	/* Test GET /:orgId/users (Get Organization Users) */
	it("GET /api/orgs/:orgId/users - should return org users", async () => {
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

	/* Test POST /:orgId/activate (Activate Admin Role) */
	it("POST /api/orgs/:orgId/activate - should assign admin role", async () => {
		const response = await app.request("/api/orgs/mock-org/activate", {
			method: "POST",
		});

		const data = await response.json();
		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
	});
});
