import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/notes/new")({
	loader: () => ({
		crumb: "New",
	}),
});
