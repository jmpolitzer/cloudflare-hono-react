// tests/e2e/auth.spec.ts
import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Authentication", () => {
	test.beforeEach(async ({ page }) => {
		await setupMocks(page);
	});

	test("should show user profile when authenticated", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByTestId("current-user-name")).toHaveText("Mock User");
		await expect(page.getByTestId("current-user-email")).toHaveText(
			"mockuser@example.com",
		);
		await expect(page.getByTestId("dashboard-breadcrumb")).toHaveText(
			"Dashboard",
		);
	});
});
