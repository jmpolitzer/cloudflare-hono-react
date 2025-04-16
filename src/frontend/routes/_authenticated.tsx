import Layout from "@/frontend/components/layouts/main";
import { Toaster } from "@/frontend/components/ui/sonner";
import {
	getCurrentUserQueryOptions,
	getUserOrgsQueryOptions,
} from "@/frontend/hooks/users";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

const Component = () => {
	return (
		<Layout>
			<Outlet />
			<Toaster />
		</Layout>
	);
};

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		const queryClient = context.queryClient;
		const user = await queryClient.fetchQuery(getCurrentUserQueryOptions);
		const userOrgs = await queryClient.fetchQuery(
			getUserOrgsQueryOptions(user.id),
		);
		/* 
			Check to see if a user exists prior to loading any authenticated routes.
			Also check to see if a user is not part of an org. This can happen if a 
			user is removed from an org.
		*/
		if (!user || !userOrgs || !userOrgs.orgs) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: Component,
});
