import { Button } from "@/frontend/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { useRemoveUserFromOrg } from "@/frontend/hooks/orgs";
import { MoreHorizontal } from "lucide-react";

interface OrgUserActionsMenuProps {
	currentUserId: string;
	orgId: string;
	userId: string;
}

export default function OrgUserActionsMenu({
	currentUserId,
	orgId,
	userId,
}: OrgUserActionsMenuProps) {
	const removeUserFromOrgMutation = useRemoveUserFromOrg();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem
					disabled={userId === currentUserId}
					onClick={() =>
						removeUserFromOrgMutation.mutate({
							orgId,
							userId,
						})
					}
				>
					Remove User
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
