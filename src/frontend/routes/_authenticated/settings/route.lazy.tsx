import OrganizationSwitcher from "@/frontend/components/orgs/org-switcher";
import Can from "@/frontend/components/rbac/can";
import OrganizationSection from "@/frontend/components/settings/organization";
import ProfileSection from "@/frontend/components/settings/profile";
import { Avatar, AvatarFallback } from "@/frontend/components/ui/avatar";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/frontend/components/ui/card";
import { useCurrentUser, useUserOrgs } from "@/frontend/hooks/users";
import { MANAGE_ORG } from "@/shared/constants";
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
		(org) => org.id === currentUser.data.currentOrg,
	);
	if (!currentOrg) return null;

	const fullName = `${currentUser.data.given_name} ${currentUser.data.family_name}`;
	const getInitials = () => {
		if (fullName) {
			return fullName
				.split(" ")
				.map((name) => name[0])
				.join("")
				.toUpperCase();
		}
		return currentUser.data.email.substring(0, 2).toUpperCase();
	};

	return (
		<Card className="mx-auto w-full max-w-3xl">
			<CardHeader className="flex justify-between pb-3 md:flex-row">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						{/* <AvatarImage src={avatarUrl || ""} alt={userName || userEmail} /> */}
						<AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<CardTitle className="text-2xl">
							{fullName || "User Profile"}
						</CardTitle>
						<CardDescription>
							Manage your account settings and preferences
						</CardDescription>
					</div>
				</div>
				{userOrgsQuery.data.orgs.length > 1 && (
					<OrganizationSwitcher
						currentOrg={currentOrg.id}
						currentUser={currentUser.data}
						orgs={userOrgsQuery.data.orgs}
					/>
				)}
			</CardHeader>
			<ProfileSection currentUser={currentUser.data} />
			<Can action={MANAGE_ORG} permissions={currentUser.data.permissions}>
				<OrganizationSection
					currentOrg={currentOrg}
					currentUser={currentUser.data}
					orgs={userOrgsQuery.data.orgs}
				/>
			</Can>
		</Card>
	);
}
