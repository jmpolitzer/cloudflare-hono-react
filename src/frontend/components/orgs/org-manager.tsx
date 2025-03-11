import EditOrg from "./edit-org";
import InviteUserToOrg from "./invite-user";
import OrgUserTable from "./org-user-table";

import type { UserOrgs } from "@/frontend/hooks/users";

interface OrgManagerProps {
	currentUserId: string;
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function OrgManager({ currentUserId, org }: OrgManagerProps) {
	return (
		<div className="grid auto-rows-min gap-4">
			<div className="pt-4 pb-4">
				<EditOrg org={org} />
			</div>
			<div>
				<h4 className="scroll-m-20 border-b pb-2 font-semibold tracking-tight first:mt-0">
					Users
				</h4>
				<InviteUserToOrg orgId={org.id} />
				<OrgUserTable currentUserId={currentUserId} orgId={org.id} />
			</div>
		</div>
	);
}
