import NavHeader from "@/frontend/components/nav/nav-header";
import NavMain from "@/frontend/components/nav/nav-main";
import NavUser from "@/frontend/components/nav/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/frontend/components/ui/sidebar";
import { useCurrentUser } from "@/frontend/hooks/users";

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const user = useCurrentUser();

	if (!user.data) return null;

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<NavHeader />
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
