import LoadingButton from "@/frontend/components/buttons/loading-button";
import OrgManager from "@/frontend/components/orgs/org-manager";
import Can from "@/frontend/components/rbac/can";
import { useActivateOrg } from "@/frontend/hooks/orgs";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/settings")({
	component: AccountComponent,
});

function AccountComponent() {
	const currentUser = useCurrentUser();
	if (!currentUser.data) return null;

	const userOrgsQuery = useUserOrgs(currentUser.data.id);
	if (!userOrgsQuery.data) return null;

	const currentOrg = userOrgsQuery.data.orgs.find(
		(org) => org.id === currentUser.data.current_org,
	);
	if (!currentOrg) return null;

	const { isPending, mutate: activateOrgMutation } = useActivateOrg();

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="rounded-xl bg-muted/50 p-4">
				<h4 className="scroll-m-20 border-b pb-2 font-semibold tracking-tight first:mt-0">
					Profile
				</h4>
				{currentUser.data.permissions.length === 0 ? (
					<div>
						<div className="flex flex-col items-center gap-4 p-4">
							<p className="leading-7 [&:not(:first-child)]:mt-6">
								Activate your organization to start inviting users.
							</p>
							<LoadingButton
								isLoading={isPending}
								label="Activate Organization"
								onClick={() =>
									// TODO: Handle Error
									activateOrgMutation({
										orgId: currentOrg.id,
									})
								}
							/>
						</div>
					</div>
				) : (
					<Can action="manage:org" permissions={currentUser.data.permissions}>
						<OrgManager currentUserId={currentUser.data.id} org={currentOrg} />
					</Can>
				)}
			</div>
		</div>
	);
}
