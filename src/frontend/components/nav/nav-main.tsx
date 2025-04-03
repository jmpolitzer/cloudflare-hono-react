import routeItems from "@/frontend/components/nav/config/routes";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/frontend/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";

export default function NavMain() {
	const location = useLocation();

	const isActive = (linkUrl: string) => {
		const segments = location.pathname.split("/").filter(Boolean);

		if (segments.length === 0 && linkUrl === "/") {
			return true;
		}

		return segments.includes(linkUrl.slice(1));
	};

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{routeItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								isActive={isActive(item.url)}
								asChild
							>
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
