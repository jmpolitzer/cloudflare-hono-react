import LoadingButton from "@/frontend/components/buttons/loading-button";
import AlertError from "@/frontend/components/errors/alert-error";
import EditOrg from "@/frontend/components/orgs/edit-org";
import InviteUserToOrg from "@/frontend/components/orgs/invite-user";
import OrgUserTable from "@/frontend/components/orgs/org-user-table";
import Can from "@/frontend/components/rbac/can";
import { CardContent } from "@/frontend/components/ui/card";
import { Separator } from "@/frontend/components/ui/separator";
import { useActivateOrg } from "@/frontend/hooks/orgs";
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
	const {
		isPending,
		isError,
		error,
		mutate: activateOrgMutation,
	} = useActivateOrg();

	/* Users must activate an org to use permissions. */
	const isOrgActivated = currentUser.permissions.length > 0;

	return (
		<CardContent className="space-y-6">
			<Separator />
			{/* Organization Information Section */}
			<div>
				<div className="mb-4 flex justify-between">
					<h3 className="font-medium text-lg">Organization Information</h3>
					{orgs.length > 1 && (
						<OrganizationSwitcher currentOrg={currentOrg.id} orgs={orgs} />
					)}
				</div>
				{isError && <AlertError message={error.message} />}
				{isOrgActivated ? (
					<Can action={MANAGE_ORG} permissions={currentUser.permissions}>
						<div className="space-y-4">
							<div className="grid gap-2">
								<EditOrg org={currentOrg} />
							</div>
						</div>
					</Can>
				) : (
					<div className="flex flex-col items-center gap-4 p-4">
						<p className="text-muted-foreground text-sm">
							Activate your organization to start inviting users.
						</p>
						<LoadingButton
							isLoading={isPending}
							label="Activate Organization"
							onClick={() =>
								activateOrgMutation({
									orgId: currentOrg.id,
								})
							}
						/>
					</div>
				)}
			</div>
			{isOrgActivated && (
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
			)}
		</CardContent>
	);
}
