import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
	loader: () => ({
		crumb: "Dashboard",
	}),
});
