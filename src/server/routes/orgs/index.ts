/**
 * TODO:
 * 1. Add org switcher to the frontend.✅
 * 2. Add org switcher to the backend.✅
 * 3. Edit organization name ✅
 * 4. Add org ownership to notes and reset org context
 * 5. Move form components to common directory.✅
 * 6. Invite users to organization.✅
 * 7. Remove users from organization.✅
 * 8. Ensure routes are protected via Postman
 * **/

import {
	getKindeClient,
	getUser,
	initKindeApi,
	sessionManager,
} from "@/server/utils/kinde";
import {
	editOrganizationSchema,
	inviteUserToOrgSchema,
} from "@/shared/validations/organization";
import { zValidator } from "@hono/zod-validator";
import { Organizations, Users } from "@kinde/management-api-js";
import { Hono } from "hono";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const orgs = app
	.use(getKindeClient)
	.use(getUser)
	.use(initKindeApi) // Inits the Kinde management API (Organizations, Users, etc.)
	.patch(
		"/:orgId",
		zValidator("form", editOrganizationSchema, (result, c) => {
			if (!result.success) {
				return c.json(
					{
						success: false,
						error: result.error,
					},
					400,
				);
			}
		}),
		async (c) => {
			const { orgId } = c.req.param();
			const formData = c.req.valid("form");

			try {
				await Organizations.updateOrganization({
					orgCode: orgId,
					requestBody: {
						...formData,
					},
				});

				/*
          User orgs are retrieved from the user's claims. To update the org name in the 
          user's claims, we need to refresh the user's claims.
        */
				await Users.refreshUserClaims({
					userId: c.var.user.id,
				});

				/* Refresh the user's tokens to ensure that the user's claims are up-to-date */
				await c.var.kindeClient.refreshTokens(sessionManager(c));

				return c.json({
					success: true,
				});
			} catch (error) {
				return c.json(
					{
						success: false,
						error,
					},
					400,
				);
			}
		},
	)
	.get("/:orgId/users", async (c) => {
		const { orgId } = c.req.param();

		try {
			const orgUsers = await Organizations.getOrganizationUsers({
				orgCode: orgId,
			});

			return c.json({
				success: true,
				users: orgUsers,
			});
		} catch (error) {
			return c.json(
				{
					success: false,
					error,
				},
				400,
			);
		}
	})
	.post(
		"/:orgId/invite",
		zValidator("form", inviteUserToOrgSchema, (result, c) => {
			if (!result.success) {
				return c.json(
					{
						success: false,
						error: result.error,
					},
					400,
				);
			}
		}),
		async (c) => {
			const { orgId } = c.req.param();
			const formData = c.req.valid("form");

			try {
				await Users.createUser({
					requestBody: {
						organization_code: orgId,
						profile: {
							given_name: formData.firstName,
							family_name: formData.lastName,
						},
						identities: [
							{
								type: "email",
								details: {
									email: formData.email,
								},
							},
						],
					},
				});

				return c.json({
					success: true,
				});
			} catch (error) {
				return c.json(
					{
						success: false,
						error,
					},
					400,
				);
			}
		},
	)
	.delete("/:orgId/users/:userId", async (c) => {
		const { orgId, userId } = c.req.param();

		try {
			await Organizations.removeOrganizationUser({
				orgCode: orgId,
				userId,
			});

			return c.json({
				success: true,
			});
		} catch (error) {
			return c.json(
				{
					success: false,
					error,
				},
				400,
			);
		}
	});
