import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/summaries")({
	component: SummariesComponent,
});

function SummariesComponent() {
	return <div>Summaries</div>;
}
