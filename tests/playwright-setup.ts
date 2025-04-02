import type { Page } from "@playwright/test";

export async function setupMocks(page: Page) {
	await page.route("/api/auth/me", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				id: "mock-user-id",
				email: "mockuser@example.com",
				given_name: "Mock",
				family_name: "User",
				picture: "mock-picture",
				currentOrg: "mock-org",
				permissions: ["manage:org"],
			}),
		});
	});

	await page.route("/api/users/mock-user-id/orgs", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				orgs: [
					{
						name: "Mock Org",
						id: "mock-org",
					},
				],
			}),
		});
	});
}
