import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/frontend/components/ui/select";
import { useUpdateOrgUserRole } from "@/frontend/hooks/orgs";
import { updateOrgUserRolesSchema } from "@/shared/validations/organization";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import type { UpdateOrgUserRoleSchemaType } from "@/frontend/hooks/orgs";

interface OrgUserRoleSelectProps {
	currentUserId: string;
	orgId: string;
	role: UpdateOrgUserRoleSchemaType["currentRoleId"];
	userId: string;
}

export default function OrgUserRoleSelect({
	currentUserId,
	orgId,
	role,
	userId,
}: OrgUserRoleSelectProps) {
	const updateOrgUserRoleMutation = useUpdateOrgUserRole(orgId);
	const form = useForm<UpdateOrgUserRoleSchemaType>({
		defaultValues: {
			userId,
			currentRoleId: role,
			newRoleId: role,
		},
		onSubmit: async ({ value }) => {
			await updateOrgUserRoleMutation.mutateAsync({
				userId,
				currentRoleId: role,
				newRoleId: value.newRoleId,
			});

			toast("User role updated");
		},
		validators: {
			onChange: updateOrgUserRolesSchema,
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
					name="newRoleId"
					// biome-ignore lint/correctness/noChildrenProp: Optimize later
					children={(field) => (
						<Select
							disabled={userId === currentUserId}
							onValueChange={(value) => {
								field.handleChange(
									value as UpdateOrgUserRoleSchemaType["newRoleId"],
								);

								form.handleSubmit();
							}}
							defaultValue={field.state.value}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="admin">admin</SelectItem>
								<SelectItem value="basic">basic</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>
		</form>
	);
}
