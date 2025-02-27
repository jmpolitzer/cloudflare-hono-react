import { zValidator } from "@hono/zod-validator";
import { Organizations, Users } from "@kinde/management-api-js";
import { Hono } from "hono";
import {
	getKindeClient,
	getUser,
	initKindeApi,
	sessionManager,
} from "../../utils/kinde";
import { editOrganizationSchema } from "./validation";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const orgs = app
	.use(getKindeClient)
	.use(getUser) // Checks that request is authenticated
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
	);

// Invite users to organization
// .post("/:orgId/invite", async (c) => {
//   const { orgId } = c.req.param();
//   const { email, role } = await c.req.json();

//   try {
//     const response = await c.var.kindeClient.createOrganizationUserInvitation(
//       sessionManager(c),
//       {
//         organization_id: orgId,
//         email: email,
//         role: role || "member", // Default to 'member' if no role specified
//       }
//     );

//     return c.json({
//       success: true,
//       message: `Invitation sent to ${email}`,
//       invitation: response,
//     });
//   } catch (error) {
//     return c.json(
//       {
//         success: false,
//         error: error.message,
//       },
//       400
//     );
//   }
// })

// // Remove users from organization
// .delete("/:orgId/users/:userId", async (c) => {
//   const { orgId, userId } = c.req.param();

//   try {
//     await c.var.kindeClient.removeOrganizationUser(sessionManager(c), {
//       organization_id: orgId,
//       user_id: userId,
//     });

//     return c.json({
//       success: true,
//       message: `User ${userId} removed from organization ${orgId}`,
//     });
//   } catch (error) {
//     return c.json(
//       {
//         success: false,
//         error: error.message,
//       },
//       400
//     );
//   }
// });
