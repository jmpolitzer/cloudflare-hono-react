import { Button } from "@/frontend/components/ui/button";
import { useNotes } from "@/frontend/hooks/notes";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/notes/")({
	component: Notes,
});

function Notes() {
	const { data: notesQuery } = useNotes();
	if (!notesQuery) return null;
	console.log(notesQuery);
	return (
		<div className="p-2">
			<Button asChild>
				<Link to="/notes/new">Create Note</Link>
			</Button>
			<h1>My Notes</h1>
			<ul>
				{notesQuery.notes.map((note) => (
					<Link to={`/notes/${note.id}`} key={note.id}>
						<li className="font-bold text-xl underline">
							<p>{note.title}</p>
							<p>{note.description}</p>
						</li>
					</Link>
				))}
			</ul>
		</div>
	);
}
