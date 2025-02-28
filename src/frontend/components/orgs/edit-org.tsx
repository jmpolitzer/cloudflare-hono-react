import { SubmitButton, TextInput } from "@/frontend/components/forms";
import { Button } from "@/frontend/components/ui/button";
import { useEditOrg } from "@/frontend/hooks/orgs";
import { editOrganizationSchema } from "@/shared/validations/organization";
import { useForm } from "@tanstack/react-form";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

import type { EditOrgSchema } from "@/frontend/hooks/orgs";
import type { UserOrgs } from "@/frontend/hooks/users";

interface EditOrgProps {
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function EditOrg({ org }: EditOrgProps) {
	const [isEditing, setIsEditing] = useState(false);
	const editOrgMutation = useEditOrg(org.id);

	const form = useForm<EditOrgSchema>({
		defaultValues: {
			name: org.name,
		},
		onSubmit: async ({ value }) => {
			await editOrgMutation.mutateAsync(value);
			setIsEditing(false);
			form.reset();
		},
		validators: {
			onChange: editOrganizationSchema,
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
							children={(field) => <TextInput field={field} label="Name" />}
						/>
					</div>
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						// biome-ignore lint/correctness/noChildrenProp: Optimize later
						children={([canSubmit, isSubmitting]) => (
							<SubmitButton isSubmitting={isSubmitting} canSubmit={canSubmit} />
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
