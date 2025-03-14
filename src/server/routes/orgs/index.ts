import {
	initResendEmailer,
	sendInviteUserToOrgEmail,
} from "@/server/utils/email/resend";
import {
	badRequestException,
	internalServerErrorRequestException,
	unknownRequestException,
	zodBadRequestException,
} from "@/server/utils/errors";
import {
	ensureUser,
	getKindeClient,
	getRoles,
	initKindeApi,
	refreshUser,
	sessionManager,
} from "@/server/utils/kinde";
import {
	editOrgSchema,
	inviteUserToOrgSchema,
	updateOrgUserRolesSchema,
} from "@/shared/validations/organization";
import { zValidator } from "@hono/zod-validator";
import { Organizations, Search, Users } from "@kinde/management-api-js";
import { Hono } from "hono";

// Create Hono app resource group with Cloudflare bindings
const app = new Hono<{ Bindings: CloudflareBindings }>();

export const orgs = app
	.use(getKindeClient)
	.use(ensureUser)
	.use(initKindeApi) // Inits the Kinde management API (Organizations, Users, etc.)
	.use(getRoles)
	.use(initResendEmailer) // Inits the Resend emailer
	/* Edit Organization */
	.patch(
		"/:orgId",
		zValidator("form", editOrgSchema, (result, c) => {
			if (!result.success) {
				throw zodBadRequestException(result.error);
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

				await refreshUser({
					userId: c.var.user.id,
					kindeClient: c.var.kindeClient,
					manager: sessionManager(c),
				});

				return c.json({
					success: true,
				});
			} catch (error) {
				throw unknownRequestException(error);
			}
		},
	)
	/* Get Organization Users */
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
			throw unknownRequestException(error);
		}
	})
	/* Create admin role for org owner. This allows for user invitations. */
	.post("/:orgId/activate", async (c) => {
		const { orgId } = c.req.param();

		try {
			const orgUsers = await Organizations.getOrganizationUsers({
				orgCode: orgId,
			});

			// Fail if org has more than one user. The owner must be the only user.
			if ((orgUsers.organization_users || []).length > 1) {
				throw badRequestException();
			}

			const foundOrgUser = (orgUsers.organization_users || []).find(
				(user) => user.id === c.var.user.id,
			);

			// Fail if user is not in the org.
			if (!foundOrgUser) {
				throw badRequestException();
			}

			const userRoles = await Organizations.getOrganizationUserRoles({
				orgCode: orgId,
				userId: c.var.user.id,
			});

			// Fail if user already has a role.
			if ((userRoles.roles || []).length > 0) {
				throw badRequestException();
			}

			await Organizations.createOrganizationUserRole({
				orgCode: orgId,
				userId: c.var.user.id,
				requestBody: {
					role_id: (c.var.roles || []).find((role) => role.name === "admin")
						?.id,
				},
			});

			// Refresh user claims
			await refreshUser({
				userId: c.var.user.id,
				kindeClient: c.var.kindeClient,
				manager: sessionManager(c),
			});

			return c.json({
				success: true,
			});
		} catch (error) {
			throw unknownRequestException(error);
		}
	})
	/* Invite User to Organization */
	.post(
		"/:orgId/invite",
		zValidator("form", inviteUserToOrgSchema, (result, c) => {
			if (!result.success) {
				throw zodBadRequestException(result.error);
			}
		}),
		async (c) => {
			const { orgId } = c.req.param();
			const formData = c.req.valid("form");

			try {
				/* Check to see if user already exists. Users can belong to multiple orgs. */
				const existingUser = await Search.searchUsers({
					query: formData.email,
				});

				if (
					existingUser.results?.[0] &&
					existingUser.results[0].email === formData.email
				) {
					/* Add existing user back to org with basic role. */

					// TODO: throw error
					if (!existingUser.results[0].id) {
						throw internalServerErrorRequestException();
					}

					await Organizations.addOrganizationUsers({
						orgCode: orgId,
						requestBody: {
							users: [
								{
									id: existingUser.results[0].id,
									roles: ["basic"],
								},
							],
						},
					});
				} else {
					/* Create new user */
					const newUser = await Users.createUser({
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

					const basicRole = (c.var.roles || []).find(
						(role) => role.name === "basic",
					);

					// TODO: throw error
					if (!newUser.id || !basicRole || !basicRole.id) {
						throw internalServerErrorRequestException();
					}

					/* Create default "basic" role */
					await Organizations.createOrganizationUserRole({
						orgCode: orgId,
						userId: newUser.id,
						requestBody: {
							role_id: basicRole.id,
						},
					});
				}

				/* Send email invitation to new org user. */
				const orgLink = `${c.env.BASE_URL}/api/auth/login?org_code=${orgId}`;

				await sendInviteUserToOrgEmail(
					c.var.resendClient,
					formData.email,
					formData.firstName,
					orgLink,
					orgId,
				);

				return c.json({
					success: true,
				});
			} catch (error) {
				throw unknownRequestException(error);
			}
		},
	)
	/* Remove User from Organization */
	.delete("/:orgId/users/:userId/roles/:roleName", async (c) => {
		const { orgId, roleName, userId } = c.req.param();
		const roles = c.var.roles || [];
		const roleId = roles.find((role) => role.name === roleName)?.id;

		if (!roleId) {
			throw internalServerErrorRequestException();
		}

		try {
			/* Remove User Org Role*/
			await Organizations.deleteOrganizationUserRole({
				orgCode: orgId,
				userId,
				roleId,
			});

			/* Remove User */
			await Organizations.removeOrganizationUser({
				orgCode: orgId,
				userId,
			});

			return c.json({
				success: true,
			});
		} catch (error) {
			throw unknownRequestException(error);
		}
	})
	/* Update user role - a user can only have one role */
	.patch(
		"/:orgId/users/:userId/roles",
		zValidator("form", updateOrgUserRolesSchema, (result, c) => {
			if (!result.success) {
				throw zodBadRequestException(result.error);
			}
		}),
		async (c) => {
			const { orgId, userId } = c.req.param();
			const formData = c.req.valid("form");
			const roles = c.var.roles || [];
			const oldRole = roles.find(
				(role) => role.name === formData.currentRoleId,
			);
			const newRole = roles.find((role) => role.name === formData.newRoleId);

			if (!oldRole || !oldRole.id || !newRole || !newRole.id) {
				throw internalServerErrorRequestException();
			}

			// Add new role
			try {
				await Organizations.createOrganizationUserRole({
					orgCode: orgId,
					userId,
					requestBody: {
						role_id: newRole.id,
					},
				});

				// Remove old role
				await Organizations.deleteOrganizationUserRole({
					orgCode: orgId,
					userId,
					roleId: oldRole.id,
				});

				return c.json({
					success: true,
				});
			} catch (error) {
				throw unknownRequestException(error);
			}
		},
	);
