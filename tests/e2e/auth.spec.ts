import { expect, test } from "@playwright/test";
import { setupMocks } from "../playwright-setup";

test.describe("Authentication", () => {
	test("should see authentication screen when not authenticated", async ({
		page,
	}) => {
		await setupMocks({ page, authenticated: false });

		await page.goto("/login");
		await expect(page.getByTestId("login-button")).toContainText("Login");
		await expect(page.getByTestId("register-button")).toContainText("Create");
	});

	test("should show user profile when authenticated", async ({ page }) => {
		await setupMocks({ page });
		await page.goto("/dashboard");
		await expect(page.getByTestId("current-user-name")).toHaveText("Mock User");
		await expect(page.getByTestId("current-user-org")).toHaveText("Mock Org");
		await expect(page.getByTestId("dashboard-breadcrumb")).toHaveText(
			"Dashboard",
		);
	});

	test("should see validation errors on login form", async ({ page }) => {
		await setupMocks({ page, authenticated: false });
		await page.goto("/login");
		await page.getByTestId("login-button").click();
		await page.getByRole("button", { name: "Sign In" }).click();
		await expect(page.getByText("Email is required")).toBeVisible();
	});

	test("should be able to login as an existing user", async ({ page }) => {
		await setupMocks({ page, authenticated: false });
		await page.goto("/login");
		await page.getByTestId("login-button").click();
		await page.getByTestId("login-email").fill("mockuser@example.com");
		await page.getByRole("button", { name: "Sign In" }).click();

		await setupMocks({ page });
		await page.goto("/dashboard");
		await expect(page.getByTestId("current-user-name")).toHaveText("Mock User");
		await expect(page.getByTestId("dashboard-breadcrumb")).toHaveText(
			"Dashboard",
		);
	});

	test("should see validation errors on registration form", async ({
		page,
	}) => {
		await setupMocks({ page, authenticated: false });
		await page.goto("/login");
		await page.getByTestId("register-button").click();
		await page.getByRole("button", { name: "Create Account" }).click();
		await expect(page.getByText("Organization name is required")).toBeVisible();
		await expect(page.getByText("Email is required")).toBeVisible();
		await expect(page.getByText("First name is required")).toBeVisible();
		await expect(page.getByText("Last name is required")).toBeVisible();
	});

	test("should be able to register as a new user", async ({ page }) => {
		const newUser = {
			id: "new-user-id",
			email: "newuser@example.com",
			given_name: "New",
			family_name: "User",
			picture: "mock-picture",
			currentOrg: "mock-org",
			permissions: ["manage:org"],
		};

		await setupMocks({ page, authenticated: false });
		await page.goto("/login");
		await page.getByTestId("register-button").click();
		await page.getByTestId("register-org-name").fill("New Org");
		await page.getByTestId("register-email").fill(newUser.email);
		await page.getByTestId("register-first-name").fill(newUser.given_name);
		await page.getByTestId("register-last-name").fill(newUser.family_name);
		await page.getByRole("button", { name: "Create Account" }).click();

		await setupMocks({ page, currentUser: newUser });
		await page.goto("/dashboard");
		await expect(page.getByTestId("current-user-name")).toHaveText(
			`${newUser.given_name} ${newUser.family_name}`,
		);
		await expect(page.getByTestId("dashboard-breadcrumb")).toHaveText(
			"Dashboard",
		);
	});

	test("should see validation errors on re-registration form", async ({
		page,
	}) => {
		await setupMocks({ page, authenticated: false });
		await page.goto("/login");
		await page.getByTestId("register-button").click();
		await page.getByRole("button", { name: "Create Account" }).click();
		await expect(page.getByText("Organization name is required")).toBeVisible();
	});

	test("should be able to re-register as an orgless user", async ({ page }) => {
		const orglessUser = {
			id: "orgless-user-id",
			email: "orglessuser@example.com",
			given_name: "Orgless",
			family_name: "User",
			picture: "mock-picture",
			currentOrg: null,
			permissions: [],
		};

		await setupMocks({ page, currentUser: orglessUser, orgs: null });

		await page.goto("/login");
		await expect(page.getByTestId("register-button")).toHaveText(
			"Register to regain access",
		);
		await page.getByTestId("register-button").click();
		await page.getByTestId("register-org-name").fill("New Org");
		await expect(page.getByTestId("register-email")).toHaveValue(
			orglessUser.email,
		);
		await expect(page.getByTestId("register-first-name")).toHaveValue(
			orglessUser.given_name,
		);
		await expect(page.getByTestId("register-last-name")).toHaveValue(
			orglessUser.family_name,
		);
	});

	test("should be able to register a new user after being an orgless user", async ({
		page,
	}) => {
		const orglessUser = {
			id: "orgless-user-id",
			email: "orglessuser@example.com",
			given_name: "Orgless",
			family_name: "User",
			picture: "mock-picture",
			currentOrg: null,
			permissions: [],
		};

		await setupMocks({ page, currentUser: orglessUser, orgs: null });
		await page.goto("/login");
		await expect(page.getByTestId("register-button")).toHaveText(
			"Register to regain access",
		);
		await page.getByTestId("register-button").click();
		await expect(page.getByTestId("register-email")).toHaveValue(
			orglessUser.email,
		);
		await page
			.getByRole("link", { name: "Register as a different user" })
			.click();

		await setupMocks({ page, authenticated: false });
		await page.goto("/login");
		await expect(page.getByTestId("register-button")).toHaveText(
			"Create a new account",
		);
		await page.getByTestId("register-button").click();
		await expect(page.getByTestId("register-email")).toBeEmpty();
	});
});
