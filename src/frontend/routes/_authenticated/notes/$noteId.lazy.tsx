import { NoteDetail } from "@/frontend/components/notes/NoteDetail";
import { useNotes } from "@/frontend/hooks/notes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/notes/$noteId")({
	component: NotePage,
});

function NotePage() {
	const { data: notesQuery } = useNotes();
	const { noteId } = Route.useParams();

	const note = notesQuery?.notes.find((note) => note.id === Number(noteId));

	if (!note) {
		return <div>Note not found</div>;
	}

	return <NoteDetail note={note} />;
}
