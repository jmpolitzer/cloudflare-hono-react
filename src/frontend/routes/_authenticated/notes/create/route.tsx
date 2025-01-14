import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/notes/create")({
	loader: () => ({
		crumb: "Create",
	}),
});
