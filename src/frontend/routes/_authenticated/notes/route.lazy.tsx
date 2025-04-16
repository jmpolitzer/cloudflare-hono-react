import { NoteDetail } from "@/frontend/components/notes/NoteDetail";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Skeleton } from "@/frontend/components/ui/skeleton";
import { useNotes } from "@/frontend/hooks/notes";
import { cn } from "@/frontend/lib/utils";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

import type { NotesType } from "@/frontend/hooks/notes";

export const Route = createLazyFileRoute("/_authenticated/notes")({
	component: Notes,
});

function EmptyState() {
	return (
		<div className="flex h-[calc(100vh-10rem)] items-center justify-center">
			<Card className="w-96">
				<CardContent className="space-y-4 pt-6 text-center">
					<div className="text-4xl text-muted-foreground">📝</div>
					<h3 className="font-semibold text-lg">No Notes Yet</h3>
					<p className="text-muted-foreground text-sm">
						Create your first note to get started
					</p>
					<Button asChild>
						<Link to="/notes/new">
							<PlusCircle className="mr-2 h-4 w-4" />
							Create Note
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

function LoadingState() {
	return (
		<div className="space-y-2">
			{[1, 2, 3].map((i) => (
				<div key={i} className="flex flex-col space-y-2 p-4">
					<Skeleton className="h-5 w-[250px]" />
					<Skeleton className="h-4 w-[350px]" />
				</div>
			))}
		</div>
	);
}

function NoteListItem({
	note,
	isSelected,
	onClick,
}: {
	note: NonNullable<NotesType>["notes"][0];
	isSelected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex w-full flex-col space-y-1 border-b p-4 text-left hover:bg-muted/50",
				isSelected && "bg-muted",
			)}
		>
			<h3 className="font-medium">{note.title}</h3>
			<div className="flex items-center space-x-2 text-muted-foreground text-sm">
				<p className="truncate">{note.description || "No description"}</p>
				<span>•</span>
				<p>{new Date(note.updatedAt).toLocaleDateString()}</p>
			</div>
		</button>
	);
}

export default function Notes() {
	const { data: notesQuery, isLoading } = useNotes();
	const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

	if (isLoading) return <LoadingState />;
	if (!notesQuery?.notes.length) return <EmptyState />;

	const selectedNote = notesQuery.notes.find(
		(note) => note.id === selectedNoteId,
	);

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">My Notes</h1>
					<p className="text-muted-foreground">
						Manage and organize your notes
					</p>
				</div>
				<Button asChild>
					<Link to="/notes/new">
						<PlusCircle className="mr-2 h-4 w-4" />
						Create Note
					</Link>
				</Button>
			</div>

			<div className="grid h-[calc(100vh-12rem)] grid-cols-5 overflow-hidden rounded-lg border">
				<div className="col-span-2 border-r">
					<ScrollArea className="h-full">
						{notesQuery.notes.map((note) => (
							<NoteListItem
								key={note.id}
								note={note}
								isSelected={note.id === selectedNoteId}
								onClick={() => setSelectedNoteId(note.id)}
							/>
						))}
					</ScrollArea>
				</div>
				<div className="col-span-3">
					<ScrollArea className="h-full">
						<div className="p-8">
							<NoteDetail note={selectedNote} showFullViewButton />
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
