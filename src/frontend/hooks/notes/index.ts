import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, type InferResponseType, hc } from "hono/client";
import { z } from "zod";

import type { AppType } from "@app-type";

export const zodNoteSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
});

export type NoteSchema = z.infer<typeof zodNoteSchema>;

const client = hc<AppType>("/");

export function useNotes() {
	return useQuery({
		queryKey: ["notes"],
		queryFn: async () => {
			const res = await client.api.notes.$get();

			return await res.json();
		},
	});
}

export function useNote(noteId: string) {
	return useQuery({
		queryKey: ["notes", noteId],
		queryFn: async () => {
			const res = await client.api.notes[":id"].$get({ param: { id: noteId } });

			return await res.json();
		},
	});
}

export function useCreateNote() {
	const queryClient = useQueryClient();

	return useMutation<
		InferResponseType<typeof client.api.notes.$post>,
		Error,
		InferRequestType<typeof client.api.notes.$post>["form"]
	>({
		mutationFn: async (newNote) => {
			const res = await client.api.notes.$post({
				form: newNote,
			});

			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
		onError: (error: Error) => {
			throw new Error(error.message);
		},
	});
}
