import { Hono } from "hono";
import { getKindeClient, getUser, sessionManager } from "../../utils/kinde";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const auth = app
	.use(getKindeClient)
	.get("/logout", async (c) => {
		const logoutUrl = await c.var.kindeClient.logout(sessionManager(c));
		return c.redirect(logoutUrl.toString());
	})
	.get("/login", async (c) => {
		const orgCode = c.req.query("org_code");
		const loginOpts = orgCode ? { org_code: orgCode } : undefined;
		const loginUrl = await c.var.kindeClient.login(
			sessionManager(c),
			loginOpts,
		);
		return c.redirect(loginUrl.toString());
	})
	.get("/register", async (c) => {
		// This is the same as register method, except it creates an organization in the background.
		const registerUrl = await c.var.kindeClient.createOrg(sessionManager(c));
		return c.redirect(registerUrl.toString());
	})
	.get("/callback", async (c) => {
		await c.var.kindeClient.handleRedirectToApp(
			sessionManager(c),
			new URL(c.req.url),
		);
		return c.redirect("/");
	})
	.get("/me", getUser, async (c) => {
		const user = c.var.user;
		return c.json(user);
	});
