import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/dashboard")({
	component: DashboardRoute,
});

function DashboardRoute() {
	return <div>Bird's Eye View</div>;
}
