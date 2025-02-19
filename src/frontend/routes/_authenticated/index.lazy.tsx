import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/")({
	component: Index,
});

function Index() {
	return <div>Dashboard</div>;
}
