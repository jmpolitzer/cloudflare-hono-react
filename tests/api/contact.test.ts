import { env as testEnv } from "cloudflare:test";
import { createContactRoutes } from "@/server/routes/contact";
import { errorHandler } from "@/server/utils/errors";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";

describe("Contact API Tests", () => {
	const setupApp = () => {
		const contact = createContactRoutes();

		return new Hono<{ Bindings: CloudflareBindings }>()
			.basePath("/api")
			.route("/contact", contact)
			.onError(errorHandler);
	};

	it("POST /api/contact - should create a contact", async () => {
		const app = setupApp();

		const mockContact = {
			name: "Mock User",
			email: "mock@email.com",
			phone: "123456789",
			reason: "general",
			message: "I need help!",
		};

		const formData = new FormData();
		formData.append("name", mockContact.name);
		formData.append("email", mockContact.email);
		formData.append("phone", mockContact.phone);
		formData.append("reason", mockContact.reason);
		formData.append("message", mockContact.message);

		const post = await app.request(
			"/api/contact",
			{ method: "POST", body: formData },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const postData = (await post.json()) as any;
		expect(post.status).toBe(201);
		expect(postData).toMatchObject({ contact: { ...mockContact } });
	});

	it("POST /api/contact - should fail with invalid form data", async () => {
		const app = setupApp();

		const formData = new FormData();
		formData.append("name", "");
		formData.append("email", "");
		formData.append("phone", "");
		formData.append("reason", "");
		formData.append("message", "");

		const post = await app.request(
			"/api/contact",
			{ method: "POST", body: formData },
			testEnv,
		);

		expect(post.status).toBe(400);
	});
});
