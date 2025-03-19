import { Button } from "@/frontend/components/ui/button";
import type { NotesType } from "@/frontend/hooks/notes";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

interface NoteDetailProps {
	note: NonNullable<NotesType>["notes"][0] | undefined;
	showFullViewButton?: boolean;
}

export function NoteDetail({
	note,
	showFullViewButton = false,
}: NoteDetailProps) {
	if (!note) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Select a note to view details</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<h2 className="font-bold text-2xl">{note.title}</h2>
					<div className="flex space-x-2 text-muted-foreground text-sm">
						<p>Created {new Date(note.createdAt).toLocaleDateString()}</p>
						<span>•</span>
						<p>Updated {new Date(note.updatedAt).toLocaleDateString()}</p>
					</div>
				</div>
				{showFullViewButton && (
					<Button variant="outline" size="sm" asChild>
						<Link
							to="/notes/$noteId"
							params={{ noteId: String(note.id) }}
							search={{ mode: "view" }}
						>
							<ArrowUpRight className="mr-2 h-4 w-4" />
							Full View
						</Link>
					</Button>
				)}
			</div>
			<p className="text-muted-foreground">
				{note.description || "No description"}
			</p>
		</div>
	);
}
