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

describe("Auth API Unit Tests", () => {
	const auth = createAuthRoutes({
		getKindeClient: mockGetKindeClient,
		ensureUser: mockEnsureUser,
	});
	const app = new Hono()
		.basePath("/api")
		.route("/auth", auth)
		.onError(errorHandler);

	it("should redirect to callback on /login", async () => {
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

	it("should redirect to callback on /register", async () => {
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

	it("should redirect to home on /logout", async () => {
		const res = await app.request(
			"/api/auth/logout",
			{ method: "GET" },
			mockKindeBindings,
		);
		expect(res.status).toBe(302);
		expect(res.headers.get("location")).toBe("http://localhost:8787/");
	});

	it("should return user data on /me", async () => {
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
