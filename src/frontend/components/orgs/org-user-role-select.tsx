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
	const updateOrgUserRoleMutation = useUpdateOrgUserRole({ orgId, userId });
	const form = useForm<UpdateOrgUserRoleSchemaType>({
		defaultValues: {
			currentRoleId: role,
			newRoleId: role,
		},
		onSubmit: async ({ value }) => {
			try {
				await updateOrgUserRoleMutation.mutateAsync({
					currentRoleId: role,
					newRoleId: value.newRoleId,
				});

				toast.success("User role updated.");
			} catch (error) {
				toast.error("Failed to update user role.");
			}
		},
		validators: {
			onChange: updateOrgUserRolesSchema,
		},
	});

	return (
		<form>
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
						value={field.state.value}
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
		</form>
	);
}
