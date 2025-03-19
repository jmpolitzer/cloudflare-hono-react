import { queryOptions, useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";

import type { AppType } from "@app-type";

const client = hc<AppType>("/");

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

export type CurrentUser = ReturnType<typeof useCurrentUser>["data"];
export type UserOrgs = ReturnType<typeof useUserOrgs>["data"];
