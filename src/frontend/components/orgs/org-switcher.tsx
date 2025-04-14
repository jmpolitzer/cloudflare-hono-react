import { Button } from "@/frontend/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/frontend/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { useLoginUser } from "@/frontend/hooks/users";
import type { CurrentUser, UserOrgs } from "@/frontend/hooks/users";
import { cn } from "@/frontend/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface OrgSwitcherProps {
	currentOrg: string;
	currentUser: NonNullable<CurrentUser>;
	orgs: NonNullable<UserOrgs>["orgs"];
}

export default function OrganizationSwitcher({
	currentOrg,
	currentUser,
	orgs,
}: OrgSwitcherProps) {
	const { mutateAsync: loginUserMutation, error, isError } = useLoginUser();
	const [open, setOpen] = useState(false);

	const activeOrg = orgs.find((org) => org.id === currentOrg);

	if (!activeOrg) return null;

	const [selectedOrganization, setSelectedOrganization] =
		useState<NonNullable<UserOrgs>["orgs"][0]>(activeOrg);

	const selectOrganization = async (
		organization: NonNullable<UserOrgs>["orgs"][0],
	) => {
		const loginUrl = await loginUserMutation({
			email: currentUser.email,
			orgId: organization.id,
		});

		setSelectedOrganization(organization);
		setOpen(false);

		window.location.href = loginUrl.redirectUrl;
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: using combobox
					role="combobox"
					aria-expanded={open}
					aria-label="Select organization"
					className="w-[240px] justify-between"
				>
					{selectedOrganization?.name}
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Switch Organization</DialogTitle>
				</DialogHeader>
				<Command className="rounded-lg border shadow-md">
					<CommandList>
						<CommandGroup heading="Organizations">
							{orgs.map((organization) => (
								<CommandItem
									key={organization.id}
									onSelect={() => selectOrganization(organization)}
									className="text-sm"
								>
									{organization.name}
									{activeOrg.id === organization.id && (
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												selectedOrganization?.id === organization.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
