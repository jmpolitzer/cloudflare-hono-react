import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
	component: Landing,
});

function Landing() {
	return <div className="p-2">This is your landing page!</div>;
}
