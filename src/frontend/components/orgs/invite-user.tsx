import LoadingButton from "@/frontend/components/buttons/loading-button";
import AlertError from "@/frontend/components/errors/alert-error";
import { Button } from "@/frontend/components/ui/button";
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
import { useInviteUserToOrg } from "@/frontend/hooks/orgs";
import { registerUserSchema } from "@/shared/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { RegisterUserSchemaType } from "@/frontend/hooks/users";

interface InviteUserToOrgProps {
	orgId: string;
}

export default function InviteUserToOrg({ orgId }: InviteUserToOrgProps) {
	const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);
	const {
		mutateAsync: inviteUserToOrgMutation,
		error,
		isError,
	} = useInviteUserToOrg(orgId);

	const form = useForm<RegisterUserSchemaType>({
		resolver: zodResolver(registerUserSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
		},
	});

	async function onSubmit(values: RegisterUserSchemaType) {
		await inviteUserToOrgMutation(values);

		if (dialogTriggerRef.current) {
			dialogTriggerRef.current.click();
		}

		toast.success(`${values.email} invited successfully.`);
		form.reset();
	}

	return (
		<Dialog>
			<div className="flex justify-end pt-4">
				<DialogTrigger asChild>
					<Button ref={dialogTriggerRef}>Invite User</Button>
				</DialogTrigger>
			</div>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Invite User</DialogTitle>
					<DialogDescription>
						Enter details for a new user here. Click submit when you're done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					{isError && <AlertError message={error.message} />}
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
