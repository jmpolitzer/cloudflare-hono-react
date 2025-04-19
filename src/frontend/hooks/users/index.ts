import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { hc } from "hono/client";

import type {
	editUserSchema,
	loginUserSchema,
	registerUserSchema,
} from "@/shared/validations/users";
import type { AppType } from "@app-type";
import type { InferRequestType, InferResponseType } from "hono/client";
import type { z } from "zod";

const client = hc<AppType>("/");

export function useRegisterUser() {
	return useMutation<
		InferResponseType<typeof client.api.auth.register.$post>,
		Error,
		InferRequestType<typeof client.api.auth.register.$post>["form"]
	>({
		mutationFn: async (registerUserForm) => {
			const res = await client.api.auth.register.$post({
				form: registerUserForm,
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return res.json();
		},
	});
}

export function useLoginUser() {
	return useMutation<
		InferResponseType<typeof client.api.auth.login.$post>,
		Error,
		InferRequestType<typeof client.api.auth.login.$post>["form"]
	>({
		mutationFn: async (loginUserForm) => {
			const { orgId, ...rest } = loginUserForm;
			const res = await client.api.auth.login.$post({
				form: rest,
				...(orgId && {
					query: {
						org_code: orgId,
					},
				}),
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return res.json();
		},
	});
}

export function useEditUser(userId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<(typeof client.api.users)[":userId"]["$patch"]>,
		Error,
		InferRequestType<(typeof client.api.users)[":userId"]["$patch"]>["form"]
	>({
		mutationFn: async (userForm) => {
			const res = await client.api.users[":userId"].$patch({
				param: { userId },
				form: userForm,
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return await res.json();
		},
		onSettled: async () => {
			return await queryClient.invalidateQueries({
				queryKey: ["get-current-user"],
			});
		},
	});
}

export const getCurrentUserQueryOptions = queryOptions({
	queryKey: ["get-current-user"],
	queryFn: async () => {
		const res = await client.api.auth.me.$get();

		if (!res.ok) {
			throw new Error("error fetching current user");
		}

		return await res.json();
	},
	staleTime: Number.POSITIVE_INFINITY,
});

export const useCurrentUser = () => {
	return useQuery(getCurrentUserQueryOptions);
};

export const getUserOrgsQueryOptions = (userId?: string) =>
	queryOptions({
		queryKey: ["user-orgs"],
		queryFn: async () => {
			if (!userId) throw new Error("Missing user id");

			const res = await client.api.users[":userId"].orgs.$get({
				param: { userId },
			});

			return await res.json();
		},
	});

export const useUserOrgs = (userId?: string) => {
	return useQuery(getUserOrgsQueryOptions(userId));
};

export type EditUserSchemaType = z.infer<typeof editUserSchema>;
export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
export type CurrentUser = ReturnType<typeof useCurrentUser>["data"];
export type UserOrgs = ReturnType<typeof useUserOrgs>["data"];
