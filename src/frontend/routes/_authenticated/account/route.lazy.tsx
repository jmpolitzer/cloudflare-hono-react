import EditOrg from "@/frontend/components/orgs/edit-org";
import InviteUserToOrg from "@/frontend/components/orgs/invite-user";
import { Button } from "@/frontend/components/ui/button";
import {
	useActivateOrg,
	useOrgUsers,
	useRemoveUserFromOrg,
} from "@/frontend/hooks/orgs";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";
import { createLazyFileRoute } from "@tanstack/react-router";
import { XIcon } from "lucide-react";

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

	const { isPending: orgUsersPending, data: orgUsers } = useOrgUsers(
		currentOrg.id,
	);
	const removeUserFromOrgMutation = useRemoveUserFromOrg();

	return (
		<div>
			<div>My Account!</div>
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
			<div>
				<EditOrg org={currentOrg} />
				{orgUsersPending ? (
					<div>Loading...</div>
				) : (
					<>
						{orgUsers && (
							<div>
								<InviteUserToOrg org={currentOrg} />
								<ul>
									{(orgUsers.users.organization_users || []).map((user) => (
										<li key={user.id}>
											<span>{user.email}</span>
											{user.id !== currentUser.data.id && (
												<Button
													onClick={() =>
														removeUserFromOrgMutation.mutate({
															orgId: currentOrg.id,
															userId: user.id ?? "",
														})
													}
												>
													<XIcon />
												</Button>
											)}
										</li>
									))}
								</ul>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
