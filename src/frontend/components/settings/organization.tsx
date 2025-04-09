import EditOrg from "@/frontend/components/orgs/edit-org";
import InviteUserToOrg from "@/frontend/components/orgs/invite-user";
import OrgUserTable from "@/frontend/components/orgs/org-user-table";
import Can from "@/frontend/components/rbac/can";
import { CardContent } from "@/frontend/components/ui/card";
import { Separator } from "@/frontend/components/ui/separator";
import type { CurrentUser, UserOrgs } from "@/frontend/hooks/users";
import { MANAGE_ORG } from "@/shared/constants";
import OrganizationSwitcher from "../orgs/org-switcher";

interface OrganizationSectionProps {
	currentOrg: NonNullable<UserOrgs>["orgs"][0];
	currentUser: NonNullable<CurrentUser>;
	orgs: NonNullable<UserOrgs>["orgs"];
}

export default function OrganizationSection({
	currentOrg,
	currentUser,
	orgs,
}: OrganizationSectionProps) {
	return (
		<CardContent className="space-y-6">
			<Separator />
			{/* Organization Information Section */}
			<div>
				<div className="mb-4 flex justify-between">
					<h3 className="font-medium text-lg">Organization Information</h3>
					<OrganizationSwitcher currentOrg={currentOrg.id} orgs={orgs} />
				</div>
				<Can action={MANAGE_ORG} permissions={currentUser.permissions}>
					<div className="space-y-4">
						<div className="grid gap-2">
							<EditOrg org={currentOrg} />
						</div>
					</div>
				</Can>
			</div>
			<Can action={MANAGE_ORG} permissions={currentUser.permissions}>
				<Separator />
				{/* Users Section */}
				<div>
					<h3 className="mb-4 font-medium text-lg">Users</h3>
					<div className="space-y-4">
						<p className="text-muted-foreground text-sm">
							Manage your organization's users and settings
						</p>
						<InviteUserToOrg orgId={currentOrg.id} />
						<OrgUserTable
							currentUserId={currentUser.id}
							orgId={currentOrg.id}
						/>
					</div>
				</div>
			</Can>
		</CardContent>
	);
}
