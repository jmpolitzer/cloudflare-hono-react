import { Button } from "@/components/ui/button";
import { useNote, useNotes } from "@/hooks/notes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const notesQuery = useNotes();
	const noteQuery = useNote("1");

	return (
		<div className="p-2">
			<h1>My Notes</h1>
			<ul>
				{notesQuery.data?.notes.map((note) => (
					<li key={note.id} className="font-bold text-xl underline">
						<p>{note.title}</p>
						<p>{note.description}</p>
					</li>
				))}
			</ul>
			{noteQuery.data?.note ? (
				<div>
					<h1>My Single Note</h1>
					<div>
						<p>{noteQuery.data.note.title}</p>
						<p>{noteQuery.data.note.description}</p>
					</div>
				</div>
			) : null}
			<Button>Click me</Button>
		</div>
	);
}
