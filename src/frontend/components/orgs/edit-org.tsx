import { Button } from "@/frontend/components/ui/button";
import { useEditOrg, zodOrgSchema } from "@/frontend/hooks/orgs";
import { useForm } from "@tanstack/react-form";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

import type { OrgSchema } from "@/frontend/hooks/orgs";
import type { UserOrgs } from "@/frontend/hooks/users";
import type { FieldApi } from "@tanstack/react-form";

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

interface EditOrgProps {
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function EditOrg({ org }: EditOrgProps) {
	const [isEditing, setIsEditing] = useState(false);
	const editOrgMutation = useEditOrg(org.id);

	const form = useForm<OrgSchema>({
		defaultValues: {
			name: org.name,
		},
		onSubmit: async ({ value }) => {
			await editOrgMutation.mutateAsync(value);
			setIsEditing(false);
			form.reset();
		},
		validators: {
			onChange: zodOrgSchema,
		},
	});

	return (
		<>
			{isEditing ? (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<div>
						<form.Field
							name="name"
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
			) : (
				<div>
					<span>{org.name}</span>
					<Button
						onClick={() => {
							setIsEditing(true);
						}}
					>
						<PencilIcon />
					</Button>
				</div>
			)}
		</>
	);
}
