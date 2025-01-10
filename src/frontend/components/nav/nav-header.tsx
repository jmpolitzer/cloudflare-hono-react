import { SidebarMenuButton } from "@/frontend/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { AudioWaveform } from "lucide-react";

export default function NavHeader() {
	return (
		<SidebarMenuButton
			asChild
			size="lg"
			className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<Link to="/">
				<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
					<AudioWaveform className="size-4" />
				</div>
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-semibold">Jombadi</span>
				</div>
			</Link>
		</SidebarMenuButton>
	);
}
