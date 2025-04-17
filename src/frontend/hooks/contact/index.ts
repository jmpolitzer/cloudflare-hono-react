import type { contactFormSchema } from "@/shared/validations/contact";
import type { AppType } from "@app-type";
import { useMutation } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { InferRequestType, InferResponseType } from "hono/client";
import type { z } from "zod";

const client = hc<AppType>("/");

export function useCreateContact() {
	return useMutation<
		InferResponseType<(typeof client.api.contact)["$post"]>,
		Error,
		InferRequestType<(typeof client.api.contact)["$post"]>["form"]
	>({
		mutationFn: async (contactForm) => {
			const res = await client.api.contact.$post({
				form: contactForm,
			});

			if (!res.ok) {
				throw new Error("Failed to create contact");
			}

			return await res.json();
		},
	});
}

export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;
