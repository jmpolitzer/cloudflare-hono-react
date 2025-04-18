import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/frontend/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/frontend/components/ui/sidebar";
import type { CurrentUser, UserOrgs } from "@/frontend/hooks/users";
import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";

export interface NavUserProps {
	orgs: NonNullable<UserOrgs>["orgs"];
	user: NonNullable<CurrentUser>;
}

export default function NavUser({ orgs, user }: NavUserProps) {
	const { isMobile } = useSidebar();
	const fullName = `${user.given_name ?? ""} ${user.family_name ?? ""}`;
	const picture = user.picture ?? undefined;
	const currentOrg = orgs.find((org) => org.id === user.currentOrg);

	if (!currentOrg) return null;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={picture} alt={fullName} />
								<AvatarFallback className="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span
									className="truncate font-semibold"
									data-testid="current-user-name"
								>
									{fullName}
								</span>
								<span
									className="truncate text-xs"
									data-testid="current-user-org"
								>
									{currentOrg.name}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={picture} alt={fullName} />
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{fullName}</span>
									<span className="truncate text-xs">{currentOrg.name}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link to="/settings">
									<Settings />
									Settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<a href="/api/auth/logout">
								<LogOut />
								Logout
							</a>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
