import EditOrg from "@/frontend/components/orgs/edit-org";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/account")({
	component: AccountComponent,
});

function AccountComponent() {
	const user = useCurrentUser();
	if (!user.data) return null;

	const userOrgsQuery = useUserOrgs(user.data.id);
	if (!userOrgsQuery.data) return null;

	const currentOrg = userOrgsQuery.data.orgs.find(
		(org) => org.id === user.data.current_org,
	);

	return (
		<div>
			<div>My Account!</div>
			{currentOrg && <EditOrg org={currentOrg} />}
		</div>
	);
}
