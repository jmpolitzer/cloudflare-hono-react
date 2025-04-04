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
import type { UserOrgs } from "@/frontend/hooks/users";
import { cn } from "@/frontend/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

interface OrgSwitcherProps {
	currentOrg: string | null;
	orgs: NonNullable<UserOrgs>["orgs"];
}

export default function OrganizationSwitcher({
	currentOrg,
	orgs,
}: OrgSwitcherProps) {
	const [open, setOpen] = useState(false);

	const activeOrg = orgs.find((org) => org.id === currentOrg);

	if (!activeOrg) return null;

	const [selectedOrganization, setSelectedOrganization] =
		useState<NonNullable<UserOrgs>["orgs"][0]>(activeOrg);

	const selectOrganization = (
		organization: NonNullable<UserOrgs>["orgs"][0],
	) => {
		setSelectedOrganization(organization);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button aria-expanded={open} aria-label="Select organization">
					Switch Organization
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
									asChild
								>
									<a href={`/api/auth/login?org_code=${organization.id}`}>
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
									</a>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
