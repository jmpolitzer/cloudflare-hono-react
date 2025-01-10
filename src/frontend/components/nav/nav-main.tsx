import routeItems from "@/frontend/components/nav/config/routes";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/frontend/components/ui/sidebar";
import { Link } from "@tanstack/react-router";

export default function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Application</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{routeItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title} asChild>
								<Link to={item.url} className="flex items-center">
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
