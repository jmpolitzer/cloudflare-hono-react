import { NoteDetail } from "@/frontend/components/notes/NoteDetail";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/frontend/components/ui/card";
import { useNotes } from "@/frontend/hooks/notes";
import { createLazyFileRoute } from "@tanstack/react-router";
import { NoteForm } from "./new.lazy";

export const Route = createLazyFileRoute("/_authenticated/notes/$noteId")({
	component: NotePage,
});

function NotePage() {
	const { data: notesQuery } = useNotes();
	const { noteId } = Route.useParams();
	const { mode } = Route.useSearch();
	const isEditing = mode === "edit";

	const note = notesQuery?.notes.find((note) => note.id === Number(noteId));

	if (!note) {
		return <div>Note not found</div>;
	}

	if (isEditing) {
		return (
			<div className="container mx-auto py-8">
				<Card>
					<CardHeader>
						<CardTitle>Edit Note</CardTitle>
					</CardHeader>
					<CardContent>
						<NoteForm
							noteId={noteId}
							initialData={{
								title: note.title,
								description: note.description,
							}}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<NoteDetail note={note} />
		</div>
	);
}
