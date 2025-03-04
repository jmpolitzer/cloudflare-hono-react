import Login from "@/frontend/components/auth/login";
import Layout from "@/frontend/components/layouts/main";
import CreateOrEditOrg from "@/frontend/components/orgs/create-or-edit-org";
import {
	getCurrentUserQueryOptions,
	getUserOrgsQueryOptions,
} from "@/frontend/hooks/users";
import { DEFAULT_ORG_NAME } from "@/shared/constants";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const Component = () => {
	/*
		Check to see if a user exists prior to loading any authenticated routes.
		User is set in route context by the beforeLoad function below. 
	*/
	const { userOrgs, user } = Route.useRouteContext();

	if (!user) {
		return <Login />;
	}

	/*
		Redirect to registration if user is not part of any org.
		This can happen if a user is removed from an org by an admin.
	*/
	if (!userOrgs || !userOrgs.orgs) {
		return <Login orgless />;
	}

	const currentOrg = userOrgs.orgs.find((org) => org.id === user?.current_org);

	// Force user to rename org.
	if (currentOrg && currentOrg.name === DEFAULT_ORG_NAME) {
		return (
			<div>
				<h3>Let's give your org a better name.</h3>
				<CreateOrEditOrg isOrgInit org={currentOrg} />
			</div>
		);
	}

	return (
		<Layout>
			<Outlet />
		</Layout>
	);
};

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		try {
			const user = await queryClient.fetchQuery(getCurrentUserQueryOptions);
			const userOrgs = await queryClient.fetchQuery(
				getUserOrgsQueryOptions(user.id),
			);
			return { userOrgs, user };
		} catch (e) {
			return { userOrgs: null, user: null };
		}
	},
	component: Component,
});
