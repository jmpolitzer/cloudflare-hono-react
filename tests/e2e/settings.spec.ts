import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Settings", () => {
	test.beforeEach(async ({ page }) => {
		await setupMocks({ page });
		await page.goto("/settings");
	});

	test("should update organization name", async ({ page }) => {
		// Click edit button
		await page.getByTestId("edit-org").click();

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

	test("should update user first and last name", async ({ page }) => {
		// Click edit button
		await page.getByTestId("edit-user").click();

		// Fill in new name
		const firstNameInput = page.locator("[name=firstName]");
		await firstNameInput.clear();
		await firstNameInput.fill("New");
		const lastNameInput = page.locator("[name=lastName]");
		await lastNameInput.clear();
		await lastNameInput.fill("Name");

		// Submit form
		await page.getByTestId("save-edit-user").click();

		// Verify success message
		await expect(page.getByText("Updated successfully")).toBeVisible();
	});

	test("should validate missing first and last name", async ({ page }) => {
		// Click edit button
		await page.getByTestId("edit-user").click();

		// Clear fields
		const firstNameInput = page.locator("[name=firstName]");
		await firstNameInput.clear();
		const lastNameInput = page.locator("[name=lastName]");
		await lastNameInput.clear();

		// Submit form
		await page.getByTestId("save-edit-user").click();

		// Verify validation messages
		expect(page.getByText("First name is required")).toBeTruthy();
		expect(page.getByText("Last name is required")).toBeTruthy();
	});

	test("should be able to switch orgs if a user belongs to more than one", async ({
		page,
	}) => {
		await setupMocks({
			page,
			orgs: {
				orgs: [
					{
						id: "mock-org",
						name: "Mock Org",
					},
					{
						id: "mock-org-1",
						name: "Mock Org 1",
					},
				],
			},
		});

		await page.getByTestId("org-switcher").click();

		expect(page.getByTestId("org-mock-org-1")).toBeTruthy();
		expect(page.getByTestId("org-mock-org-21")).toBeTruthy();
	});

	test("should not be able to switch orgs if a user belongs to only one", async ({
		page,
	}) => {
		await expect(page.getByTestId("edit-user")).toBeInViewport();
		await expect(page.getByTestId("org-switcher")).not.toBeInViewport();
	});

	test("should see org settings as org admin", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "Organization Information " }),
		).toBeInViewport();
	});

	test("should not see org settings as org basic", async ({ page }) => {
		const basicUser = {
			id: "basic-user-id",
			email: "basicsuser@example.com",
			given_name: "Basic",
			family_name: "User",
			picture: "mock-picture",
			currentOrg: "mock-org",
			permissions: [],
		};

		await setupMocks({ page, currentUser: basicUser });
		await expect(
			page.getByRole("heading", { name: "Organization Information " }),
		).not.toBeInViewport();
	});
});
