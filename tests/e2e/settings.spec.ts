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

	// test("should invite new user", async ({ page }) => {
	// 	// Navigate to Users tab
	// 	await page.getByRole("tab", { name: "Users" }).click();

	// 	// Click invite button
	// 	await page.getByRole("button", { name: "Invite User" }).click();

	// 	// Fill in invite form
	// 	await page.getByLabel("Email").fill("newuser@example.com");
	// 	await page.getByLabel("First Name").fill("New");
	// 	await page.getByLabel("Last Name").fill("User");

	// 	// Submit form
	// 	await page.getByRole("button", { name: "Send Invitation" }).click();

	// 	// Verify success message
	// 	await expect(page.getByText("Invitation sent successfully")).toBeVisible();
	// });

	// test("should change user role", async ({ page }) => {
	// 	// Navigate to Users tab
	// 	await page.getByRole("tab", { name: "Users" }).click();

	// 	// Open role menu for a user
	// 	await page.getByRole("button", { name: "Change Role" }).first().click();

	// 	// Select new role
	// 	await page.getByRole("menuitem", { name: "Admin" }).click();

	// 	// Verify success message
	// 	await expect(page.getByText("Role updated successfully")).toBeVisible();
	// });

	// test("should remove user from organization", async ({ page }) => {
	// 	// Navigate to Users tab
	// 	await page.getByRole("tab", { name: "Users" }).click();

	// 	// Click remove button for a user
	// 	await page.getByRole("button", { name: "Remove User" }).first().click();

	// 	// Confirm removal
	// 	await page.getByRole("button", { name: "Confirm" }).click();

	// 	// Verify success message
	// 	await expect(page.getByText("User removed successfully")).toBeVisible();
	// });

	// test("should handle errors gracefully", async ({ page }) => {
	// 	// Navigate to Users tab
	// 	await page.getByRole("tab", { name: "Users" }).click();

	// 	// Try to invite user with invalid email
	// 	await page.getByRole("button", { name: "Invite User" }).click();
	// 	await page.getByLabel("Email").fill("invalid-email");
	// 	await page.getByRole("button", { name: "Send Invitation" }).click();

	// 	// Verify error message
	// 	await expect(
	// 		page.getByText("Please enter a valid email address"),
	// 	).toBeVisible();
	// });
});
