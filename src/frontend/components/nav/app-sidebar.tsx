import HeaderLogo from "@/frontend/components/nav/header-logo";
import NavMain from "@/frontend/components/nav/nav-main";
import NavUser from "@/frontend/components/nav/nav-user";
import type { NavUserProps } from "@/frontend/components/nav/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/frontend/components/ui/sidebar";

export default function AppSidebar({ orgs, user }: NavUserProps) {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<HeaderLogo />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<NavUser orgs={orgs} user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
