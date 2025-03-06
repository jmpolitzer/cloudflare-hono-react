import { Button } from "@/frontend/components/ui/button";
import { useOrgUsers, useRemoveUserFromOrg } from "@/frontend/hooks/orgs";
import { XIcon } from "lucide-react";
import EditOrg from "./edit-org";
import InviteUserToOrg from "./invite-user";

import type { UserOrgs } from "@/frontend/hooks/users";

interface OrgManagerProps {
	currentUserId: string;
	org: NonNullable<UserOrgs>["orgs"][0];
}

export default function OrgManager({ currentUserId, org }: OrgManagerProps) {
	const { isPending: orgUsersPending, data: orgUsers } = useOrgUsers(org.id);
	const removeUserFromOrgMutation = useRemoveUserFromOrg();

	return (
		<div>
			<EditOrg org={org} />
			{orgUsersPending ? (
				<div>Loading...</div>
			) : (
				<>
					{orgUsers && (
						<div>
							<InviteUserToOrg orgId={org.id} />
							<ul>
								{(orgUsers.users.organization_users || []).map((user) => (
									<li key={user.id}>
										<span>{user.full_name}</span> <span>{user.email}</span>{" "}
										{user.roles && (
											<span>
												{user.roles.map((role) => (
													<span key={role}>{role}</span>
												))}
											</span>
										)}{" "}
										{user.id !== currentUserId && (
											<span>
												<Button
													onClick={() =>
														removeUserFromOrgMutation.mutate({
															orgId: org.id,
															userId: user.id ?? "",
														})
													}
												>
													<XIcon />
												</Button>
											</span>
										)}
									</li>
								))}
							</ul>
						</div>
					)}
				</>
			)}
		</div>
	);
}
