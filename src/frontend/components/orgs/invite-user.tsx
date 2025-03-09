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
import { inviteUserToOrgSchema } from "@/shared/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { InviteUserToOrgSchemaType } from "@/frontend/hooks/orgs";

interface InviteUserToOrgProps {
	orgId: string;
}

export default function InviteUserToOrg({ orgId }: InviteUserToOrgProps) {
	const dialogTriggerRef = useRef<HTMLButtonElement | null>(null);
	const inviteUserToOrgMutation = useInviteUserToOrg(orgId);

	const form = useForm<InviteUserToOrgSchemaType>({
		resolver: zodResolver(inviteUserToOrgSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
		},
	});

	async function onSubmit(values: InviteUserToOrgSchemaType) {
		await inviteUserToOrgMutation.mutateAsync(values);

		if (dialogTriggerRef.current) {
			dialogTriggerRef.current.click();
		}

		toast.success(`${values.email} invited successfully.`);
		form.reset();
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button ref={dialogTriggerRef} variant="outline">
					Invite User
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Invite User</DialogTitle>
					<DialogDescription>
						Enter details for a new user here. Click submit when you're done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
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
						<Button type="submit">
							{form.formState.isSubmitting ? (
								<LoaderIcon className="animate-spin" />
							) : (
								"Submit"
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
