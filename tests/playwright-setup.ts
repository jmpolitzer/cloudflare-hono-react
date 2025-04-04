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

	await page.route("/api/notes?page=1&limit=50", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				notes: [
					{
						id: 1,
						title: "Test Note",
						description: "This is a test note with more detailed content.",
						userId: "mock-user-id",
						orgId: "mock-org",
						createdAt: "2024-01-01T00:00:00Z",
						updatedAt: "2024-01-01T00:00:00Z",
					},
					{
						id: 2,
						title: "Another Note",
						description: "This is another test note",
						userId: "mock-user-id",
						orgId: "mock-org",
						createdAt: "2024-01-02T00:00:00Z",
						updatedAt: "2024-01-02T00:00:00Z",
					},
				],
				pagination: {
					total: 2,
					page: 1,
					limit: 10,
					totalPages: 1,
				},
			}),
		});
	});

	await page.route("/api/orgs/mock-org/users", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				users: {
					organization_users: [
						{
							id: "mock-user-id",
							email: "mockuser@example.com",
							full_name: "Mock User",
							picture: "https://example.com/avatar.jpg",
							roles: ["admin"],
							created_at: "2024-01-01T00:00:00Z",
							updated_at: "2024-01-01T00:00:00Z",
						},
						{
							id: "basic-user-id",
							email: "basicuser@example.com",
							full_name: "Basic User",
							picture: "https://example.com/avatar2.jpg",
							roles: ["basic"],
							created_at: "2024-01-02T00:00:00Z",
							updated_at: "2024-01-02T00:00:00Z",
						},
						{
							id: "new-user-id",
							email: "newuser@example.com",
							full_name: "New User",
							picture: null,
							roles: ["basic"],
							created_at: "2024-01-03T00:00:00Z",
							updated_at: "2024-01-03T00:00:00Z",
						},
					],
				},
			}),
		});
	});

	await page.route("/api/orgs/mock-org", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ success: true }),
		});
	});
}
