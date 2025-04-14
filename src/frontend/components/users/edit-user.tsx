import LoadingButton from "@/frontend/components/buttons/loading-button";
import AlertError from "@/frontend/components/errors/alert-error";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/frontend/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { useEditUser } from "@/frontend/hooks/users";
import { editUserSchema } from "@/shared/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EditButton from "../buttons/edit-button";

import type { CurrentUser, EditUserSchemaType } from "@/frontend/hooks/users";

interface EditUserProps {
	currentUser: NonNullable<CurrentUser>;
}

export default function EditUser({ currentUser }: EditUserProps) {
	const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);
	const {
		mutateAsync: editUserMutation,
		error,
		isError,
	} = useEditUser(currentUser.id);

	const form = useForm<EditUserSchemaType>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			firstName: currentUser.given_name,
			lastName: currentUser.family_name,
		},
	});

	async function onSubmit(values: EditUserSchemaType) {
		await editUserMutation(values);

		if (dialogTriggerRef.current) {
			dialogTriggerRef.current.click();
		}

		toast.success("Updated successfully.");
		form.reset(values);
	}

	return (
		<Dialog>
			<div className="flex justify-end pt-4">
				<DialogTrigger asChild>
					<EditButton ref={dialogTriggerRef} />
				</DialogTrigger>
			</div>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>
						Edit your user info here. Click submit when you're done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					{isError && <AlertError message={error.message} />}
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton
							label="Submit"
							isLoading={form.formState.isSubmitting}
							type="submit"
						/>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
