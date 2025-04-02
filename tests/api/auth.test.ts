import { createAuthRoutes } from "@/server/routes/auth";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import {
	mockEnsureUser,
	mockGetKindeClient,
	mockKindeBindings,
	mockUnauthorizedError,
} from "../vitest-setup";
import type { MockKindeClientOptions } from "../vitest-setup";

describe("Auth API Tests", () => {
	const setupApp = (authOptions?: MockKindeClientOptions) => {
		const auth = createAuthRoutes({
			getKindeClient: mockGetKindeClient(authOptions),
			ensureUser: mockEnsureUser,
		});
		return new Hono()
			.basePath("/api")
			.route("/auth", auth)
			.onError(errorHandler);
	};

	// GET /api/auth/login
	it("GET /api/auth/login - should redirect to callback (unauthenticated)", async () => {
		const app = setupApp({ isAuthenticated: false });

		const res = await app.request(
			"/api/auth/login",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			"http://localhost:8787/auth/callback",
		);
	});

	it("GET /api/auth/login - should redirect even if authenticated", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "test-user-id",
				email: "test@example.com",
				given_name: "Test",
				family_name: "User",
				picture: "test-picture-url",
				orgCode: "mock-org",
			},
		});

		const res = await app.request(
			"/api/auth/login",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			"http://localhost:8787/auth/callback",
		);
	});

	// GET /api/auth/register
	it("GET /api/auth/register - should redirect to callback (unauthenticated)", async () => {
		const app = setupApp({ isAuthenticated: false });

		const res = await app.request(
			"/api/auth/register",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe(
			"http://localhost:8787/auth/callback",
		);
	});

	// GET /api/auth/logout
	it("GET /api/auth/logout - should redirect to home (authenticated)", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "test-user-id",
				email: "test@example.com",
				given_name: "Test",
				family_name: "User",
				picture: "test-picture-url",
				orgCode: "mock-org", // Set orgCode
			},
		});

		const res = await app.request(
			"/api/auth/logout",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:8787/");
	});

	it("GET /api/auth/logout - should redirect to home (unauthenticated)", async () => {
		const app = setupApp({ isAuthenticated: false });

		const res = await app.request(
			"/api/auth/logout",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:8787/");
	});

	// GET /api/auth/me
	it("GET /api/auth/me - should return user data (authenticated)", async () => {
		const expectedUser = {
			id: "test-user-id",
			email: "test@example.com",
			given_name: "Test",
			family_name: "User",
			picture: "test-picture-url",
			currentOrg: "mock-org",
			permissions: [],
		};
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "test-user-id",
				email: "test@example.com",
				given_name: "Test",
				family_name: "User",
				picture: "test-picture-url",
				permissions: [],
				orgCode: "mock-org",
			},
		});

		const res = await app.request(
			"/api/auth/me",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual(expectedUser);
	});

	it("GET /api/auth/me - should fail if unauthenticated", async () => {
		const app = setupApp({ isAuthenticated: false });

		const res = await app.request(
			"/api/auth/me",
			{ method: "GET" },
			mockKindeBindings,
		);
		const json = await res.json();
		expect(res.status).toBe(401);
		expect(json).toMatchObject(mockUnauthorizedError);
	});
});
