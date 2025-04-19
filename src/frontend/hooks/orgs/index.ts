import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

import type { UserOrgs } from "@/frontend/hooks/users";
import type {
	editOrgSchema,
	updateOrgUserRolesSchema,
} from "@/shared/validations/organizations";
import type { inviteUserSchema } from "@/shared/validations/users";
import type { AppType } from "@app-type";
import type { InferRequestType, InferResponseType } from "hono";
import type { z } from "zod";

const client = hc<AppType>("/");

export function useEditOrg(orgId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<(typeof client.api.orgs)[":orgId"]["$patch"]>,
		Error,
		InferRequestType<(typeof client.api.orgs)[":orgId"]["$patch"]>["form"]
	>({
		mutationFn: async (orgForm) => {
			const res = await client.api.orgs[":orgId"].$patch({
				param: { orgId },
				form: orgForm,
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return await res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["user-orgs"],
			});
		},
	});
}

export function useInviteUserToOrg(org: NonNullable<UserOrgs>["orgs"][0]) {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<(typeof client.api.orgs)[":orgId"]["invite"]["$post"]>,
		Error,
		InferRequestType<
			(typeof client.api.orgs)[":orgId"]["invite"]["$post"]
		>["form"]
	>({
		mutationFn: async (invitedUserForm) => {
			const res = await client.api.orgs[":orgId"].invite.$post({
				param: { orgId: org.id },
				form: invitedUserForm,
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return await res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["org-users"],
			});
		},
	});
}

export function useRemoveUserFromOrg() {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<
			(typeof client.api.orgs)[":orgId"]["users"][":userId"]["roles"][":roleName"]["$delete"]
		>,
		Error,
		InferRequestType<
			(typeof client.api.orgs)[":orgId"]["users"][":userId"]["roles"][":roleName"]["$delete"]
		>["param"]
	>({
		mutationFn: async ({ orgId, roleName, userId }) => {
			const res = await client.api.orgs[":orgId"].users[":userId"].roles[
				":roleName"
			].$delete({
				param: { orgId, roleName, userId },
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return await res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["org-users"],
			});
		},
	});
}

export function useOrgUsers(orgId: string) {
	return useQuery({
		queryKey: ["org-users"],
		queryFn: async () => {
			const res = await client.api.orgs[":orgId"].users.$get({
				param: { orgId },
			});

			if (!res.ok) {
				throw new Error("Failed to fetch organization users");
			}

			return await res.json();
		},
	});
}

export function useUpdateOrgUserRole({
	orgId,
	userId,
}: { orgId: string; userId: string }) {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<
			(typeof client.api.orgs)[":orgId"]["users"][":userId"]["roles"]["$patch"]
		>,
		Error,
		InferRequestType<
			(typeof client.api.orgs)[":orgId"]["users"][":userId"]["roles"]["$patch"]
		>["form"]
	>({
		mutationFn: async (orgForm) => {
			const res = await client.api.orgs[":orgId"].users[":userId"].roles.$patch(
				{
					param: { orgId, userId },
					form: orgForm,
				},
			);

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return await res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["org-users"],
			});
		},
	});
}

export type EditOrgSchemaType = z.infer<typeof editOrgSchema>;
export type InviteUserSchemaType = z.infer<typeof inviteUserSchema>;
export type UpdateOrgUserRoleSchemaType = z.infer<
	typeof updateOrgUserRolesSchema
>;
