import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/frontend/components/ui/sidebar";
import { APP_NAME } from "@/shared/constants";
import { Link } from "@tanstack/react-router";
import { Power } from "lucide-react";

export default function HeaderLogo() {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						className="data-[slot=sidebar-menu-button]:!p-1.5"
					>
						<Link to="/dashboard">
							<Power className="h-5 w-5" />
							<span className="font-semibold text-base">{APP_NAME}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
