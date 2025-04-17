import { createUsersRoutes } from "@/server/routes/users";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	mockEnsureUser,
	mockGetKindeClient,
	mockInitKindeApi,
	mockKindeBindings,
	mockRefreshUser,
	mockUsers,
	mockZodError,
} from "../vitest-setup";
import type { MockKindeClientOptions } from "../vitest-setup";

describe("Users API Tests", () => {
	// Helper to create app with configurable auth options
	const setupApp = (usersOptions?: MockKindeClientOptions) => {
		const users = createUsersRoutes({
			getKindeClient: mockGetKindeClient(usersOptions),
			initKindeApi: mockInitKindeApi,
			ensureUser: mockEnsureUser,
			refreshUser: mockRefreshUser,
			Users: mockUsers,
		});

		return new Hono()
			.basePath("/api")
			.route("/users", users)
			.onError(errorHandler);
	};

	beforeEach(() => {
		vi.restoreAllMocks();
	});

	/* Test PATCH /:userId (Edit User) */
	it("PATCH /api/users/:userId - should update user (owner)", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const formData = new FormData();
		formData.append("firstName", "Mock");
		formData.append("lastName", "User");

		const response = await app.request(
			"/api/users/mock-user-id",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });
	});

	it("PATCH /api/users/:userId - should not update user (non-owner)", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "unauthorized-mock-user-id",
				orgCode: "mock-org",
			},
		});

		const formData = new FormData();
		formData.append("firstName", "Mock");
		formData.append("lastName", "User");

		const response = await app.request(
			"/api/users/mock-user-id",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);

		expect(response.status).toBe(401);
	});

	it("PATCH /api/users/:userId - should fail validation", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const formData = new FormData();
		formData.append("firstName", "");
		formData.append("lastName", "");

		const response = await app.request(
			"/api/users/mock-user-id",
			{ method: "PATCH", body: formData },
			mockKindeBindings,
		);
		const data = await response.json();

		expect(response.status).toBe(400);
		expect(data).toMatchObject(
			mockZodError("First name is required,\nLast name is required"),
		);
	});
});
