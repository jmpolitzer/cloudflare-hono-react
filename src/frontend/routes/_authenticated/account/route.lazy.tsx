import OrgManager from "@/frontend/components/orgs/org-manager";
import Can from "@/frontend/components/rbac/can";
import { Button } from "@/frontend/components/ui/button";
import { useActivateOrg } from "@/frontend/hooks/orgs";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/account")({
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

	const activateOrg = useActivateOrg();

	return (
		<div>
			<div>My Account!</div>
			{currentUser.data.permissions.length === 0 ? (
				<div>
					<Button
						onClick={() =>
							activateOrg.mutate({
								orgId: currentOrg.id,
							})
						}
					>
						Activate Org
					</Button>
				</div>
			) : (
				<Can action="manage:org" permissions={currentUser.data.permissions}>
					<OrgManager currentUserId={currentUser.data.id} org={currentOrg} />
				</Can>
			)}
		</div>
	);
}
