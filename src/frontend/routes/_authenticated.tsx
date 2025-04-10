import LoginOrRegister from "@/frontend/components/auth/login-or-register";
import Layout from "@/frontend/components/layouts/main";
import { Toaster } from "@/frontend/components/ui/sonner";
import {
	getCurrentUserQueryOptions,
	getUserOrgsQueryOptions,
} from "@/frontend/hooks/users";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const Component = () => {
	/*
		Check to see if a user exists prior to loading any authenticated routes.
		User is set in route context by the beforeLoad function below. 
	*/
	const { userOrgs, user } = Route.useRouteContext();

	if (!user) {
		return <LoginOrRegister />;
	}

	/*
		Redirect to registration if user is not part of any org.
		This can happen if a user is removed from an org by an admin.
	*/
	if (!userOrgs || !userOrgs.orgs) {
		return <LoginOrRegister currentUser={user} />;
	}

	return (
		<Layout>
			<Outlet />
			<Toaster />
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
