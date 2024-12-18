import type { AppType } from "@app-type";
import { useQuery } from "@tanstack/react-query";
import { hc } from "hono/client";

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
