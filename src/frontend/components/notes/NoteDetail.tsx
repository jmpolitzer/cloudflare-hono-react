import type { NotesType } from "@/frontend/hooks/notes";
interface NoteDetailProps {
	note: NonNullable<NotesType>["notes"][0] | undefined;
}

export function NoteDetail({ note }: NoteDetailProps) {
	if (!note) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Select a note to view details</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 p-8">
			<div className="space-y-1">
				<h2 className="font-bold text-2xl">{note.title}</h2>
				<div className="flex space-x-2 text-muted-foreground text-sm">
					<p>Created {new Date(note.createdAt).toLocaleDateString()}</p>
					<span>•</span>
					<p>Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
				</div>
			</div>
			<p className="text-muted-foreground">
				{note.description || "No description"}
			</p>
		</div>
	);
}
