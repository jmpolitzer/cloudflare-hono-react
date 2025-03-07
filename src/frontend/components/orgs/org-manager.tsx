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
		<div>
			<EditOrg org={org} />
			<InviteUserToOrg orgId={org.id} />
			<OrgUserTable currentUserId={currentUserId} orgId={org.id} />
		</div>
	);
}
