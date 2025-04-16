import LoginOrRegister from "@/frontend/components/auth/login-or-register";
import LoadingSpinner from "@/frontend/components/ui/loading-spinner";
import { getCurrentUserQueryOptions } from "@/frontend/hooks/users";
import { createFileRoute } from "@tanstack/react-router";

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
	pendingComponent: LoadingSpinner,
});

function AuthComponent() {
	const { user } = Route.useRouteContext();

	return <LoginOrRegister currentUser={user} />;
}
