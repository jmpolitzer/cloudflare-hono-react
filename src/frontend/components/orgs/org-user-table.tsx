import { Button } from "@/frontend/components/ui/button";
import { useOrgUsers, useRemoveUserFromOrg } from "@/frontend/hooks/orgs";
import { XIcon } from "lucide-react";
import OrgUserRoleSelect from "./org-user-role-select";

import type { UpdateOrgUserRoleSchemaType } from "@/frontend/hooks/orgs";

interface UserTableProps {
	currentUserId: string;
	orgId: string;
}

export default function OrgUserTable({ currentUserId, orgId }: UserTableProps) {
	const { isPending: orgUsersPending, data: orgUsers } = useOrgUsers(orgId);
	const removeUserFromOrgMutation = useRemoveUserFromOrg();

	if (!orgUsers && !orgUsersPending) return null;

	return (
		<>
			{orgUsersPending ? (
				<div>Loading...</div>
			) : (
				<ul>
					{(orgUsers.users.organization_users || []).map((user) => (
						<li key={user.id}>
							<span>{user.full_name}</span> <span>{user.email}</span>{" "}
							{user.roles?.[0] && (
								<div>
									{user.id !== currentUserId ? (
										<OrgUserRoleSelect
											orgId={orgId}
											role={
												user
													.roles[0] as UpdateOrgUserRoleSchemaType["oldRoleId"]
											}
											userId={user.id ?? ""}
										/>
									) : (
										<span>{user.roles[0]}</span>
									)}
								</div>
							)}{" "}
							{user.id !== currentUserId && (
								<span>
									<Button
										onClick={() =>
											removeUserFromOrgMutation.mutate({
												orgId: orgId,
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
			)}
		</>
	);
}
