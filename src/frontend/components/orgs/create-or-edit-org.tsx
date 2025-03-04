import { SubmitButton, TextInput } from "@/frontend/components/forms";
import { Button } from "@/frontend/components/ui/button";
import { useCreateOrg, useEditOrg } from "@/frontend/hooks/orgs";
import { createOrEditOrgSchema } from "@/shared/validations/organization";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

import type { CreateOrEditOrgSchema } from "@/frontend/hooks/orgs";
import type { UserOrgs } from "@/frontend/hooks/users";

interface CreateOrEditOrgProps {
	isOrgInit?: boolean;
	org?: NonNullable<UserOrgs>["orgs"][0];
}

export default function CreateOrEditOrg({
	isOrgInit = false,
	org,
}: CreateOrEditOrgProps) {
	const [isEditing, setIsEditing] = useState(!org || isOrgInit);
	const navigate = useNavigate();
	const createOrgMutation = useCreateOrg();
	const editOrgMutation = useEditOrg(org?.id ?? "");

	const form = useForm<CreateOrEditOrgSchema>({
		defaultValues: {
			name: org?.name ?? "",
		},
		onSubmit: async ({ value }) => {
			await (org ? editOrgMutation : createOrgMutation).mutateAsync(value);
			setIsEditing(false);

			if (isOrgInit) {
				navigate({ to: "/" });
			} else {
				form.reset();
			}
		},
		validators: {
			onChange: createOrEditOrgSchema,
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
					<span>{org?.name}</span>
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
