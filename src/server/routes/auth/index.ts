import { Hono } from "hono";
import { getKindeClient, getUser, sessionManager } from "./utils";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const auth = app
	.use(getKindeClient)
	.get("/logout", async (c) => {
		const logoutUrl = await c.var.kindeClient.logout(sessionManager(c));
		return c.redirect(logoutUrl.toString());
	})
	.get("/login", async (c) => {
		const loginUrl = await c.var.kindeClient.login(sessionManager(c));
		return c.redirect(loginUrl.toString());
	})
	.get("/register", async (c) => {
		const registerUrl = await c.var.kindeClient.register(sessionManager(c));
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
