import { Button } from "@/frontend/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/frontend/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { Textarea } from "@/frontend/components/ui/textarea";
import { useCreateNote, useUpdateNote } from "@/frontend/hooks/notes";
import type { NoteFormSchemaType } from "@/frontend/hooks/notes";
import { noteFormSchema } from "@/shared/validations/notes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

interface NoteFormProps {
	noteId?: string;
	initialData?: {
		title: string;
		description?: string | null;
	};
}

export function NoteForm({ noteId, initialData }: NoteFormProps) {
	const navigate = useNavigate();
	const createNote = useCreateNote();
	const updateNote = useUpdateNote(noteId ?? "");
	const navigateTo = noteId ? `/notes/${noteId}?mode=view` : "/notes";

	const form = useForm<NoteFormSchemaType>({
		resolver: zodResolver(noteFormSchema),
		defaultValues: {
			title: initialData?.title ?? "",
			description: initialData?.description ?? "",
		},
	});

	async function onSubmit(data: NoteFormSchemaType) {
		try {
			if (noteId) {
				await updateNote.mutateAsync(data);
			} else {
				await createNote.mutateAsync(data);
			}

			navigate({ to: navigateTo });
		} catch (error) {
			console.error("Failed to save note:", error);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Note title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Add your note content here..."
									className="min-h-[200px] resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center space-x-4">
					<Button
						type="submit"
						disabled={createNote.isPending || updateNote.isPending}
					>
						{createNote.isPending || updateNote.isPending
							? "Saving..."
							: noteId
								? "Update Note"
								: "Create Note"}
					</Button>
					<Button variant="outline" asChild>
						<Link to={navigateTo}>Cancel</Link>
					</Button>
				</div>
			</form>
		</Form>
	);
}

export const Route = createLazyFileRoute("/_authenticated/notes/new")({
	component: NewNote,
});

export default function NewNote() {
	return (
		<div className="container mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle>Create Note</CardTitle>
					<CardDescription>Add a new note to your collection</CardDescription>
				</CardHeader>
				<CardContent>
					<NoteForm />
				</CardContent>
			</Card>
		</div>
	);
}
