// tests/e2e/auth.spec.ts
import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Authentication", () => {
	test.beforeEach(async ({ page }) => {
		await setupMocks(page);
	});

	test("should show user profile when authenticated", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByText("Mock User")).toBeVisible();
		await expect(page.getByText("mockuser@example.com")).toBeVisible();
		await expect(page.getByText("Dashboard")).toBeVisible();
	});
});
