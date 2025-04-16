import { getCurrentUserQueryOptions } from "@/frontend/hooks/users";
import { createFileRoute } from "@tanstack/react-router";
import LoginOrRegister from "../components/auth/login-or-register";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context: { queryClient } }) => {
		try {
			const user = await queryClient.fetchQuery(getCurrentUserQueryOptions);

			return { user };
		} catch (e) {
			return { user: null };
		}
	},
	component: AuthComponent,
});

function AuthComponent() {
	const { user } = Route.useRouteContext();

	return <LoginOrRegister currentUser={user} />;
}
