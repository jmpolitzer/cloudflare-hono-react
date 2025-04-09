import AppSidebar from "@/frontend/components/nav/app-sidebar";
import Breadcrumbs from "@/frontend/components/nav/breadcrumbs";
import { Separator } from "@/frontend/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/frontend/components/ui/sidebar";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const user = useCurrentUser();
	if (!user.data) return null;

	const userOrgsQuery = useUserOrgs(user.data.id);
	if (!userOrgsQuery.data) return null;

	return (
		<SidebarProvider>
			<AppSidebar orgs={userOrgsQuery.data?.orgs || []} user={user.data} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumbs />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
