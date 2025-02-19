import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/notes/$noteId")({
	loader: ({ params: { noteId } }) => ({
		crumb: noteId,
	}),
});
