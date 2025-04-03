import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/frontend/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export default function HeaderLogo() {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						className="data-[slot=sidebar-menu-button]:!p-1.5"
					>
						<Link to="/">
							<Mail className="h-5 w-5" />
							<span className="font-semibold text-base">Envelope</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	);
}
