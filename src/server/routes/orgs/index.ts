import {
	initResendEmailer as defaultInitResendEmailer,
	sendInviteUserToOrgEmail,
} from "@/server/utils/email/resend";
import {
	internalServerErrorRequestException,
	unauthorizedRequestException,
	unknownRequestException,
	zodBadRequestException,
} from "@/server/utils/errors";
import {
	ensureOrgAdmin as defaultEnsureOrgAdmin,
	ensureOrgAssociation as defaultEnsureOrgAssociation,
	ensureUser as defaultEnsureUser,
	getRoles as defaultGetRoles,
	initKindeApi as defaultInitKindeApi,
	getKindeClient as defaultKindeClient,
	refreshUser as defaultRefreshUser,
	registerUserToOrg as defaultRegisterUserToOrg,
	sessionManager,
} from "@/server/utils/kinde";
import type { KindeRouteBindings } from "@/server/utils/kinde";
import {
	editOrgSchema,
	updateOrgUserRolesSchema,
} from "@/shared/validations/organizations";
import { inviteUserSchema } from "@/shared/validations/users";
import { zValidator } from "@hono/zod-validator";
import {
	Organizations as defaultOrganizations,
	Search as defaultSearch,
} from "@kinde/management-api-js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export function createOrgsRoutes({
	ensureUser = defaultEnsureUser,
	ensureOrgAdmin = defaultEnsureOrgAdmin,
	ensureOrgAssociation = defaultEnsureOrgAssociation,
	getKindeClient = defaultKindeClient,
	getRoles = defaultGetRoles,
	initKindeApi = defaultInitKindeApi,
	refreshUser = defaultRefreshUser,
	initResendEmailer = defaultInitResendEmailer,
	registerUserToOrg = defaultRegisterUserToOrg,
	Organizations = defaultOrganizations,
	Search = defaultSearch,
}: KindeRouteBindings = {}) {
	/* Create Hono app resource group with Cloudflare bindings */
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const orgs = app
		.use(getKindeClient)
		.use(ensureUser)
		/* Inits the Kinde management API (Organizations, Users, etc.) */
		.use(initKindeApi)
		.use(getRoles)
		/* Inits the Resend emailer */
		.use(initResendEmailer)
		/* Edit Organization */
		.patch(
			"/:orgId",
			ensureOrgAssociation,
			ensureOrgAdmin,
			zValidator("form", editOrgSchema, (result, c) => {
				if (!result.success) {
					throw zodBadRequestException(result.error);
				}
			}),
			async (c) => {
				const { orgId } = c.req.param();
				const formData = c.req.valid("form");

				if (orgId !== c.var.user.currentOrg) {
					throw unauthorizedRequestException();
				}

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
					if (error instanceof HTTPException) {
						throw error;
					}

					throw unknownRequestException(error);
				}
			},
		)
		/* Get Organization Users */
		.get("/:orgId/users", ensureOrgAssociation, ensureOrgAdmin, async (c) => {
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
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		})
		/* Invite User to Organization */
		.post(
			"/:orgId/invite",
			ensureOrgAssociation,
			ensureOrgAdmin,
			zValidator("form", inviteUserSchema, (result, c) => {
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

					/* Invite existing user or create and invite new user. */
					await registerUserToOrg({
						orgId,
						role: "basic",
						user: existingUser.results?.[0]?.id
							? existingUser.results[0].id
							: formData,
					});

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
					if (error instanceof HTTPException) {
						throw error;
					}

					throw unknownRequestException(error);
				}
			},
		)
		/* Remove User from Organization */
		.delete(
			"/:orgId/users/:userId/roles/:roleName",
			ensureOrgAssociation,
			ensureOrgAdmin,
			async (c) => {
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
					if (error instanceof HTTPException) {
						throw error;
					}

					throw unknownRequestException(error);
				}
			},
		)
		/* Update user role - a user can only have one role */
		.patch(
			"/:orgId/users/:userId/roles",
			ensureOrgAssociation,
			ensureOrgAdmin,
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

				/* Add new role */
				try {
					await Organizations.createOrganizationUserRole({
						orgCode: orgId,
						userId,
						requestBody: {
							role_id: newRole.id,
						},
					});

					/* Remove old role */
					await Organizations.deleteOrganizationUserRole({
						orgCode: orgId,
						userId,
						roleId: oldRole.id,
					});

					return c.json({
						success: true,
					});
				} catch (error) {
					if (error instanceof HTTPException) {
						throw error;
					}

					throw unknownRequestException(error);
				}
			},
		);

	return orgs;
}

export const orgs = createOrgsRoutes();
