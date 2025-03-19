import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

import type { noteFormSchema } from "@/shared/validations/notes";
import type { AppType } from "@app-type";
import type { InferRequestType, InferResponseType } from "hono/client";
import type { z } from "zod";

const client = hc<AppType>("/");

export function useNotes() {
	return useQuery({
		queryKey: ["notes"],
		queryFn: async () => {
			const res = await client.api.notes.$get({
				query: {
					page: "1",
					limit: "50",
				},
			});

			if (!res.ok) {
				throw new Error("Failed to fetch notes");
			}

			return await res.json();
		},
	});
}

export function useCreateNote() {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<(typeof client.api.notes)["$post"]>,
		Error,
		InferRequestType<(typeof client.api.notes)["$post"]>["form"]
	>({
		mutationFn: async (noteForm) => {
			const res = await client.api.notes.$post({
				form: noteForm,
			});

			if (!res.ok) {
				throw new Error("Failed to create note");
			}

			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
	});
}

export function useUpdateNote(noteId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<(typeof client.api.notes)[":noteId"]["$put"]>,
		Error,
		InferRequestType<(typeof client.api.notes)[":noteId"]["$put"]>["form"]
	>({
		mutationFn: async (noteForm) => {
			const res = await client.api.notes[":noteId"].$put({
				param: { noteId },
				form: noteForm,
			});

			if (!res.ok) {
				throw new Error("Failed to update note");
			}

			return await res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
	});
}

export type NoteFormSchemaType = z.infer<typeof noteFormSchema>;
export type NotesType = ReturnType<typeof useNotes>["data"];
