import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import { z } from "zod";

import type { AppType } from "@app-type";
import type { InferRequestType, InferResponseType } from "hono";

export const zodOrgSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

export type OrgSchema = z.infer<typeof zodOrgSchema>;

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
