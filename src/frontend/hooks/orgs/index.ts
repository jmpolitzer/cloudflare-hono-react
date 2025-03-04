import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { z } from "zod";

import type {
	createOrEditOrgSchema,
	inviteUserToOrgSchema,
} from "@/shared/validations/organization";
import type { AppType } from "@app-type";
import type { InferRequestType, InferResponseType } from "hono";

const client = hc<AppType>("/");

export function useCreateOrg() {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<typeof client.api.orgs.$post>,
		Error,
		InferRequestType<typeof client.api.orgs.$post>["form"]
	>({
		mutationFn: async (orgForm) => {
			const res = await client.api.orgs.$post({
				form: orgForm,
			});

			return res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["user-orgs"],
			});
		},
		onError: (error: Error) => {
			throw new Error(error.message);
		},
	});
}

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

			return res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["user-orgs"],
			});
		},
		onError: (error: Error) => {
			throw new Error(error.message);
		},
	});
}

export function useInviteUserToOrg(orgId: string) {
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
				param: { orgId },
				form: invitedUserForm,
			});

			return res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["org-users"],
			});
		},
		onError: (error: Error) => {
			throw new Error(error.message);
		},
	});
}

export function useRemoveUserFromOrg() {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<
			(typeof client.api.orgs)[":orgId"]["users"][":userId"]["$delete"]
		>,
		Error,
		InferRequestType<
			(typeof client.api.orgs)[":orgId"]["users"][":userId"]["$delete"]
		>["param"]
	>({
		mutationFn: async ({ orgId, userId }) => {
			const res = await client.api.orgs[":orgId"].users[":userId"].$delete({
				param: { orgId, userId },
			});

			return res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["org-users"],
			});
		},
		onError: (error: Error) => {
			throw new Error(error.message);
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

			return await res.json();
		},
	});
}

export type CreateOrEditOrgSchema = z.infer<typeof createOrEditOrgSchema>;
export type InviteUserToOrgSchema = z.infer<typeof inviteUserToOrgSchema>;
