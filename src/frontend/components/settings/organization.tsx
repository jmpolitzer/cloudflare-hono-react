import EditOrg from "@/frontend/components/orgs/edit-org";
import InviteUserToOrg from "@/frontend/components/orgs/invite-user";
import OrgUserTable from "@/frontend/components/orgs/org-user-table";
import { CardContent } from "@/frontend/components/ui/card";
import { Separator } from "@/frontend/components/ui/separator";
import type { CurrentUser, UserOrgs } from "@/frontend/hooks/users";

interface OrganizationSectionProps {
	currentOrg: NonNullable<UserOrgs>["orgs"][0];
	currentUser: NonNullable<CurrentUser>;
	orgs: NonNullable<UserOrgs>["orgs"];
}

export default function OrganizationSection({
	currentOrg,
	currentUser,
}: OrganizationSectionProps) {
	return (
		<CardContent className="space-y-6">
			<Separator />
			{/* Organization Information Section */}
			<div>
				<div className="mb-4 flex justify-between">
					<h3 className="font-medium text-lg">Organization Information</h3>
				</div>
				<div className="space-y-4">
					<div className="grid gap-2">
						<EditOrg org={currentOrg} />
					</div>
				</div>
			</div>
			<Separator />
			{/* Users Section */}
			<div>
				<h3 className="mb-4 font-medium text-lg">Users</h3>
				<div className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Manage your organization's users and settings
					</p>
					<InviteUserToOrg org={currentOrg} />
					<OrgUserTable currentUserId={currentUser.id} orgId={currentOrg.id} />
				</div>
			</div>
		</CardContent>
	);
}
