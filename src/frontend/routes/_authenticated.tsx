import Login from "@/frontend/components/auth/login";
import Layout from "@/frontend/components/layouts/main";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { getCurrentUserQueryOptions } from "../hooks/users";

const Component = () => {
	const { user } = Route.useRouteContext();

	if (!user) {
		return <Login />;
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
			return { user };
		} catch (e) {
			return { user: null };
		}
	},
	component: Component,
});
