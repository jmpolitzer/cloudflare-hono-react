import { Button } from "@/frontend/components/ui/button";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/notes")({
	component: Notes,
});

function Notes() {
	return (
		<div>
			<h3>All My Notes</h3>
			<Button asChild>
				<Link to="/notes/create">Create Note</Link>
			</Button>
		</div>
	);
}
