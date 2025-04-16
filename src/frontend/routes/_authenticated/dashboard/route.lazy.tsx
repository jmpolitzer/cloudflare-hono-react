import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/dashboard")({
	component: Index,
});

function Index() {
	return <div>Bird's Eye View</div>;
}
