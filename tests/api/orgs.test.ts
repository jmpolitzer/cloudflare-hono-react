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

	it("GET /api/orgs/:orgId/users - should return org users", async () => {
		const res = await app.request(
			"/api/orgs/mock-org/users",
			{ method: "GET" },
			mockKindeBindings,
		);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data).toEqual({
			success: true,
			users: {
				organization_users: [
					{ id: "mock-user-id", email: "mockuser@example.com" },
				],
			},
		});
	});
});
