import AlertError from "@/frontend/components/errors/alert-error";
import { Button } from "@/frontend/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { useEditOrg } from "@/frontend/hooks/orgs";
import { editOrgSchema } from "@/shared/validations/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { EditOrgSchemaType } from "@/frontend/hooks/orgs";
import type { UserOrgs } from "@/frontend/hooks/users";

interface CreateOrEditOrgProps {
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function EditOrg({ org }: CreateOrEditOrgProps) {
	const [isEditing, setIsEditing] = useState(false);
	const { mutateAsync: editOrgMutation, error, isError } = useEditOrg(org.id);

	const form = useForm<EditOrgSchemaType>({
		resolver: zodResolver(editOrgSchema),
		defaultValues: {
			name: org?.name ?? "",
		},
	});

	async function onSubmit(values: EditOrgSchemaType) {
		await editOrgMutation(values);

		setIsEditing(false);
		toast.success("Organization updated.");
	}

	return (
		<Form {...form}>
			{isError && <AlertError className="mb-2" message={error.message} />}
			{isEditing ? (
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="flex gap-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<Input className="flex-1" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							size="icon"
							variant="ghost"
							title="Update"
							type="submit"
							data-testid="save-edit-org"
						>
							<Save className="h-4 w-4" />
						</Button>
						<Button
							size="icon"
							variant="ghost"
							onClick={() => {
								setIsEditing(false);
								form.reset();
							}}
							title="Cancel"
							type="button"
							data-testid="cancel-edit-org"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</form>
			) : (
				<div className="flex items-center justify-between">
					<span className="text-muted-foreground text-sm">{org.name}</span>
					<Button
						size="sm"
						variant="ghost"
						className="h-8 px-2"
						onClick={() => setIsEditing(true)}
						type="button"
					>
						<Edit className="mr-1 h-3.5 w-3.5" />
						Edit
					</Button>
				</div>
			)}
		</Form>
	);
}
