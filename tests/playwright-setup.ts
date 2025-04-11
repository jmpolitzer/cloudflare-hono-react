import type { CurrentUser } from "@/frontend/hooks/users";
import type { Page } from "@playwright/test";

interface PlaywrightMocks {
	page: Page;
	authenticated?: boolean;
	currentUser?: CurrentUser;
	orgs?: boolean;
}

export async function setupMocks({
	page,
	authenticated = true,
	currentUser,
	orgs = true,
}: PlaywrightMocks) {
	await page.route("/api/auth/register", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				redirectUrl: "http://localhost:5173/api/auth/callback",
			}),
		});
	});

	await page.route("/api/auth/callback", (route) => {
		route.fulfill({
			status: 302,
			contentType: "application/json",
		});
	});

	await page.route("/api/auth/logout", (route) => {
		route.fulfill({
			status: 302,
			contentType: "application/json",
		});
	});

	await page.route("/api/auth/me", (route) => {
		route.fulfill({
			status: authenticated ? 200 : 401,
			contentType: "application/json",
			body: JSON.stringify(
				authenticated
					? (currentUser ?? {
							id: "mock-user-id",
							email: "mockuser@example.com",
							given_name: "Mock",
							family_name: "User",
							picture: "mock-picture",
							currentOrg: "mock-org",
							permissions: ["manage:org"],
						})
					: {
							status: 401,
						},
			),
		});
	});

	await page.route("/api/users/*/orgs", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify(
				orgs
					? {
							orgs: [
								{
									name: "Mock Org",
									id: "mock-org",
								},
							],
						}
					: null,
			),
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

	await page.route("/api/orgs/mock-org/invite", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ success: true }),
		});
	});

	await page.route("/api/orgs/mock-org/users/basic-user-id/roles", (route) => {
		route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({ success: true }),
		});
	});

	await page.route(
		"/api/orgs/mock-org/users/basic-user-id/roles/basic",
		(route) => {
			route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ success: true }),
			});
		},
	);
}
