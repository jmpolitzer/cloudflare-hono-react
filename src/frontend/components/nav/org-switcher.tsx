import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	// DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/frontend/components/ui/sidebar";
import type { UserOrgs } from "@/frontend/hooks/users";

interface OrgSwitcherProps {
	currentOrg: string | null;
	orgs: NonNullable<UserOrgs>["orgs"];
}

export default function OrgSwitcher({ currentOrg, orgs }: OrgSwitcherProps) {
	const { isMobile } = useSidebar();
	const [activeOrg, setActiveOrg] = React.useState(
		orgs.find((org) => org.id === currentOrg),
	);

	if (!activeOrg) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								{/* <activeOrg.logo className="size-4" /> */}
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{activeOrg.name}</span>
								{/* <span className="truncate text-xs">{activeOrg.plan}</span> */}
							</div>
							<ChevronsUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Teams
						</DropdownMenuLabel>
						{orgs.map((org, index) => (
							<DropdownMenuItem
								key={org.name}
								onClick={() => setActiveOrg(org)}
								className="gap-2 p-2"
							>
								<div className="flex size-6 items-center justify-center rounded-sm border">
									{/* <team.logo className="size-4 shrink-0" /> */}
								</div>
								{org.name}
								{/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
							</DropdownMenuItem>
						))}
						{/* <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem> */}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
