import { SubmitButton, TextInput } from "@/frontend/components/forms";
import { useForm } from "@tanstack/react-form";

import { useInviteUserToOrg } from "@/frontend/hooks/orgs";
import type { InviteUserToOrgSchema } from "@/frontend/hooks/orgs";
import type { UserOrgs } from "@/frontend/hooks/users";
import { inviteUserToOrgSchema } from "@/shared/validations/organization";

interface InviteUserToOrgProps {
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function InviteUserToOrg({ org }: InviteUserToOrgProps) {
	const inviteUserToOrgMutation = useInviteUserToOrg(org.id);

	const form = useForm<InviteUserToOrgSchema>({
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
		},
		onSubmit: async ({ value }) => {
			await inviteUserToOrgMutation.mutateAsync(value);
			form.reset();
		},
		validators: {
			onChange: inviteUserToOrgSchema,
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
					name="email"
					// biome-ignore lint/correctness/noChildrenProp: Optimize later
					children={(field) => <TextInput field={field} label="Email" />}
				/>
			</div>
			<div>
				<form.Field
					name="firstName"
					// biome-ignore lint/correctness/noChildrenProp: Optimize later
					children={(field) => <TextInput field={field} label="First Name" />}
				/>
			</div>
			<div>
				<form.Field
					name="lastName"
					// biome-ignore lint/correctness/noChildrenProp: Optimize later
					children={(field) => <TextInput field={field} label="Last Name" />}
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
	);
}
