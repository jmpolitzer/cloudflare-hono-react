import { Button } from "@/frontend/components/ui/button";
import { useCreateNote, zodNoteSchema } from "@/frontend/hooks/notes";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";

import type { NoteSchema } from "@/frontend/hooks/notes";
import type { FieldApi } from "@tanstack/react-form";

export const Route = createLazyFileRoute("/_authenticated/notes/new")({
	component: CreateNote,
});

// biome-ignore lint/suspicious/noExplicitAny: Generic types are inferred
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
	return (
		<>
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
				<em>{field.state.meta.errors.join(",")}</em>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
}

function CreateNote() {
	const navigate = useNavigate();
	const createNoteMutation = useCreateNote();

	const form = useForm<NoteSchema>({
		defaultValues: {
			title: "",
			description: "",
		},
		onSubmit: async ({ value }) => {
			await createNoteMutation.mutateAsync(value);
			form.reset();
			navigate({ to: "/notes" });
		},
		validators: {
			onChange: zodNoteSchema,
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div>
				<form.Field
					name="title"
					// biome-ignore lint/correctness/noChildrenProp: Optimize later
					children={(field) => (
						<>
							<label htmlFor={field.name}>Title:</label>
							<input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</>
					)}
				/>
				<form.Field
					name="description"
					// biome-ignore lint/correctness/noChildrenProp: Optimize later
					children={(field) => (
						<>
							<label htmlFor={field.name}>Description:</label>
							<input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</>
					)}
				/>
			</div>
			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				// biome-ignore lint/correctness/noChildrenProp: Optimize later
				children={([canSubmit, isSubmitting]) => (
					<Button type="submit" disabled={!canSubmit}>
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				)}
			/>
		</form>
	);
}
