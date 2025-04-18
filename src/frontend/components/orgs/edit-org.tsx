import EditButton from "@/frontend/components/buttons/edit-button";
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
import {
	ToastOperation,
	ToastResult,
	toast,
} from "@/frontend/components/ui/sonner";
import { useEditOrg } from "@/frontend/hooks/orgs";
import { editOrgSchema } from "@/shared/validations/organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
		try {
			await editOrgMutation(values);

			toast({
				entity: "organization",
				operation: ToastOperation.Update,
				result: ToastResult.Success,
			});
			setIsEditing(false);
		} catch (error) {
			toast({
				entity: "organization",
				operation: ToastOperation.Update,
				result: ToastResult.Failure,
			});
		}
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
					<EditButton
						data-testid="edit-org"
						onClick={() => setIsEditing(true)}
					/>
				</div>
			)}
		</Form>
	);
}
