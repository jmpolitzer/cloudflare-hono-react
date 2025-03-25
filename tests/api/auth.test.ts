import { createAuthRoutes } from "@/server/routes/auth";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { mockCurrentUser } from "tests/mocks";
import { describe, expect, it } from "vitest";
import {
	mockEnsureUser,
	mockGetKindeClient,
	mockKindeBindings,
} from "../setup";

describe("Auth API Tests", () => {
	const auth = createAuthRoutes({
		getKindeClient: mockGetKindeClient,
		ensureUser: mockEnsureUser,
	});
	const app = new Hono()
		.basePath("/api")
		.route("/auth", auth)
		.onError(errorHandler);

	it("GET /api/auth/login - should redirect to callback", async () => {
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

	it("GET /api/auth/register - should redirect to callback", async () => {
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

	it("GET /api/auth/logout - should redirect to home", async () => {
		const res = await app.request(
			"/api/auth/logout",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:8787/");
	});

	it("GET /api/auth/me - should return user data", async () => {
		const res = await app.request(
			"/api/auth/me",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual(mockCurrentUser);
	});
});
