import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Navigation", () => {
	test.beforeEach(async ({ page }) => {
		await setupMocks(page);
	});

	test("should navigate between main sections", async ({ page }) => {
		await page.goto("/");

		// Navigate to Notes
		await page.getByRole("link", { name: "Notes" }).click();
		expect(page.url()).toContain("/notes");
		await expect(
			page.getByRole("heading", { name: "Test Note" }),
		).toBeVisible();

		// Navigate to Settings
		await page.getByTestId("current-user-name").click();
		await page.getByRole("menuitem", { name: "Settings" }).click();
		expect(page.url()).toContain("/settings");
		await expect(
			page.getByRole("heading", { name: "Organization Information" }),
		).toBeVisible();

		// Navigate back home
		await page.getByRole("link", { name: "Dashboard" }).click();
		expect(page.url()).toBe("http://localhost:5173/");
	});

	// test("should show breadcrumb navigation", async ({ page }) => {
	// 	await page.goto("/notes");

	// 	// Check breadcrumb structure
	// 	await expect(
	// 		page.getByRole("navigation", { name: "Breadcrumb" }),
	// 	).toContainText("Notes");

	// 	// Navigate to a specific note
	// 	await page.getByText("Test Note").click();
	// 	await expect(
	// 		page.getByRole("navigation", { name: "Breadcrumb" }),
	// 	).toContainText("Notes / Test Note");
	// });
});
