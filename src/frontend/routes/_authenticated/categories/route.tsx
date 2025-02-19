import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/categories")({
	loader: () => ({
		crumb: "Categories",
	}),
});
