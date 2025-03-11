import { Button } from "@/frontend/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { useEditOrg } from "@/frontend/hooks/orgs";
import { editOrgSchema } from "@/shared/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { EditOrgSchemaType } from "@/frontend/hooks/orgs";
import type { UserOrgs } from "@/frontend/hooks/users";
interface CreateOrEditOrgProps {
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function EditOrg({ org }: CreateOrEditOrgProps) {
	const editOrgMutation = useEditOrg(org.id);

	const form = useForm<EditOrgSchemaType>({
		resolver: zodResolver(editOrgSchema),
		defaultValues: {
			name: org?.name ?? "",
		},
	});

	async function onSubmit(values: EditOrgSchemaType) {
		await editOrgMutation.mutateAsync(values);

		// TODO: Handle Error
		toast.success("Organization updated.");
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Organization Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">
					{form.formState.isSubmitting ? (
						<LoaderIcon className="animate-spin" />
					) : (
						"Update"
					)}
				</Button>
			</form>
		</Form>
	);
}
