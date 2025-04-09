import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Authentication", () => {
	test("should see authentication screen when not authenticated", async ({
		page,
	}) => {
		await page.goto("/");
		await expect(page.getByTestId("login-button")).toContainText("Login");
		await expect(page.getByTestId("register-button")).toContainText("Create");
	});

	test("should show user profile when authenticated", async ({ page }) => {
		await setupMocks(page);
		await page.goto("/");
		await expect(page.getByTestId("current-user-name")).toHaveText("Mock User");
		await expect(page.getByTestId("current-user-org")).toHaveText("Mock Org");
		await expect(page.getByTestId("dashboard-breadcrumb")).toHaveText(
			"Dashboard",
		);
	});
});
