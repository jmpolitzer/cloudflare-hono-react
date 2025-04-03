// import OrgSwitcher from "@/frontend/components/nav/org-switcher";
import HeaderLogo from "@/frontend/components/nav/header-logo";
import NavMain from "@/frontend/components/nav/nav-main";
import NavUser from "@/frontend/components/nav/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/frontend/components/ui/sidebar";
import type { CurrentUser, UserOrgs } from "@/frontend/hooks/users";

interface SidebarProps {
	currentOrg: string | null;
	orgs: NonNullable<UserOrgs>["orgs"];
	user: NonNullable<CurrentUser>;
}

export default function AppSidebar({ currentOrg, orgs, user }: SidebarProps) {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<HeaderLogo />
				{/* Uncomment to enable users to switch between orgs. */}
				{/* <OrgSwitcher currentOrg={currentOrg} orgs={orgs} /> */}
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
