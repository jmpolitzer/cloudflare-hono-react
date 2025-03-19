import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { useDeleteNote } from "@/frontend/hooks/notes";
import type { NotesType } from "@/frontend/hooks/notes";
import { Link, useNavigate } from "@tanstack/react-router";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface NoteDetailProps {
	note: NonNullable<NotesType>["notes"][0] | undefined;
	showFullViewButton?: boolean;
}

export function NoteDetail({
	note,
	showFullViewButton = false,
}: NoteDetailProps) {
	const navigate = useNavigate();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const deleteNote = useDeleteNote();

	if (!note) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Select a note to view details</p>
			</div>
		);
	}

	async function handleDelete(noteId: string) {
		try {
			await deleteNote.mutateAsync({ noteId });
			setIsDeleteDialogOpen(false);
			navigate({ to: "/notes", search: { mode: "view" } });
		} catch (error) {
			console.error("Failed to delete note:", error);
		}
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
				<div className="inline-flex items-center rounded-md border bg-card text-card-foreground shadow-sm">
					{showFullViewButton && (
						<Button
							variant="ghost"
							size="sm"
							asChild
							className="rounded-r-none border-r"
						>
							<Link
								to="/notes/$noteId"
								params={{ noteId: String(note.id) }}
								search={{ mode: "view" }}
							>
								<ExternalLink className="h-4 w-4" />
								<span className="sr-only">View full note</span>
							</Link>
						</Button>
					)}
					<Button
						variant="ghost"
						size="sm"
						asChild
						className={
							showFullViewButton
								? "rounded-none border-r"
								: "rounded-r-none border-r"
						}
					>
						<Link
							to="/notes/$noteId"
							params={{ noteId: String(note.id) }}
							search={{ mode: "edit" }}
						>
							<Pencil className="h-4 w-4" />
							<span className="sr-only">Edit note</span>
						</Link>
					</Button>
					<Dialog
						open={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}
					>
						<DialogTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className={
									"rounded-l-none text-destructive hover:text-destructive"
								}
							>
								<Trash2 className="h-4 w-4" />
								<span className="sr-only">Delete note</span>
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete Note</DialogTitle>
								<DialogDescription>
									Are you sure you want to delete this note? This action cannot
									be undone.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<Button
									variant="outline"
									onClick={() => setIsDeleteDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={() => handleDelete(String(note.id))}
									disabled={deleteNote.isPending}
								>
									{deleteNote.isPending ? "Deleting..." : "Delete"}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<p className="text-muted-foreground">
				{note.description || "No description"}
			</p>
		</div>
	);
}
