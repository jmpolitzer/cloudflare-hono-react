import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Settings", () => {
	test.beforeEach(async ({ page }) => {
		await setupMocks(page);
		await page.goto("/settings");
	});

	test("should update organization name", async ({ page }) => {
		// Click edit button
		await page.getByRole("button", { name: "Edit" }).click();

		// Fill in new name
		const nameInput = page.locator("[name=name]");
		await nameInput.clear();
		await nameInput.fill("Updated Org");

		// Submit form
		await page.getByTestId("save-edit-org").click();

		// Verify success message
		await expect(page.getByText("Organization updated.")).toBeVisible();
	});

	test("should display organization users", async ({ page }) => {
		// Verify user list
		await expect(page.getByText("basicuser@example.com")).toBeVisible();
		await expect(page.getByText("Basic User")).toBeVisible();
		await expect(page.getByText("newuser@example.com")).toBeVisible();
		await expect(page.getByText("New User")).toBeVisible();
	});

	test("should invite new user", async ({ page }) => {
		const newUserEmail = "newuser@example.com";

		// Click invite button
		await page.getByRole("button", { name: "Invite User" }).click();

		// Fill in invite form
		await page.getByLabel("Email").fill(newUserEmail);
		await page.getByLabel("First Name").fill("New");
		await page.getByLabel("Last Name").fill("User");

		// Submit form
		await page.getByRole("button", { name: "Submit" }).click();

		// Verify success message
		await expect(
			page.getByText(`${newUserEmail} invited successfully`),
		).toBeVisible();
	});

	test("should change user role", async ({ page }) => {
		// Open role menu for a user
		await page.getByTestId("role-select-basic-user-id").click();

		// Select new role
		await page.getByTestId("admin-role-option-basic-user-id").click();

		// Verify success message
		await expect(page.getByText("User role updated")).toBeVisible();
	});

	test("should remove user from organization", async ({ page }) => {
		// Click user menu and remove button for a user
		await page.getByTestId("user-menu-basic-user-id").click();
		await page.getByTestId("remove-user-basic-user-id").click();

		// Verify success message
		await expect(
			page.getByText("User removed from organization."),
		).toBeVisible();
	});

	test("should handle errors gracefully", async ({ page }) => {
		// Try to invite user with invalid email
		await page.getByRole("button", { name: "Invite User" }).click();
		await page.getByLabel("Email").fill("invalid-email");
		await page.getByRole("button", { name: "Submit" }).click();

		// Verify error message
		await expect(page.getByText("This is not a valid email")).toBeVisible();
	});
});
