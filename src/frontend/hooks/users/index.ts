import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";

import type {
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
			const res = await client.api.auth.login.$post({
				form: loginUserForm,
			});

			if (!res.ok) {
				throw new Error(res.statusText);
			}

			return res.json();
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

export const getUserOrgsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["user-orgs"],
		queryFn: async () => {
			const res = await client.api.users[":id"].orgs.$get({
				param: { id: userId },
			});

			return await res.json();
		},
	});

export const useUserOrgs = (userId: string) => {
	return useQuery(getUserOrgsQueryOptions(userId));
};

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;
export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
export type CurrentUser = ReturnType<typeof useCurrentUser>["data"];
export type UserOrgs = ReturnType<typeof useUserOrgs>["data"];
