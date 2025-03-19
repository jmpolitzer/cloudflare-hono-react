import { NoteDetail } from "@/frontend/components/notes/NoteDetail";
import { Button } from "@/frontend/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/frontend/components/ui/card";
import { useNotes } from "@/frontend/hooks/notes";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { NoteForm } from "./new.lazy";

export const Route = createLazyFileRoute("/_authenticated/notes/$noteId")({
	component: NotePage,
});

function NotePage() {
	const { data: notesQuery } = useNotes();
	const { noteId } = Route.useParams();
	const navigate = useNavigate();
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
			<div className="flex justify-end">
				<Button
					variant="outline"
					size="sm"
					onClick={() =>
						navigate({
							to: "/notes/$noteId",
							params: { noteId },
							search: { mode: "edit" },
						})
					}
				>
					<Pencil className="mr-2 h-4 w-4" />
					Edit Note
				</Button>
			</div>
			<NoteDetail note={note} />
		</div>
	);
}
