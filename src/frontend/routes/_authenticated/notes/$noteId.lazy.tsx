import { useNote } from "@/frontend/hooks/notes";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/notes/$noteId")({
	component: Note,
});

function Note() {
	const noteId = Route.useParams({
		select: (params) => params.noteId,
	});
	const noteQuery = useNote(noteId);

	return (
		<div className="p-2">
			{noteQuery.data?.note ? (
				<div>
					<div>
						<p>{noteQuery.data.note.title}</p>
						<p>{noteQuery.data.note.description}</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
