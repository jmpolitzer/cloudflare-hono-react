import NavMain from "@/frontend/components/nav/nav-main";
import NavUser from "@/frontend/components/nav/nav-user";
import OrgSwitcher from "@/frontend/components/nav/org-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/frontend/components/ui/sidebar";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const user = useCurrentUser();

	if (!user.data) return null;

	const userOrgsQuery = useUserOrgs(user.data.id);

	if (!userOrgsQuery.data) return null;

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<OrgSwitcher
					currentOrg={user.data.current_org}
					orgs={userOrgsQuery.data?.orgs || []}
				/>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user.data} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
