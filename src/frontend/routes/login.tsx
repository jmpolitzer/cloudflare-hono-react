import LoginOrRegister from "@/frontend/components/auth/login-or-register";
import LoadingSpinner from "@/frontend/components/ui/loading-spinner";
import { getCurrentUserQueryOptions } from "@/frontend/hooks/users";
import type { CurrentUser } from "@/frontend/hooks/users";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context: { queryClient }, location }) => {
		let user: CurrentUser;

		try {
			user = await queryClient.fetchQuery(getCurrentUserQueryOptions);

			/* Send user back where they came from if authenticated. */
			if (user?.currentOrg) {
				throw redirect({
					to: "/dashboard",
				});
			}

			return { user };
		} catch (e) {
			if (e instanceof Error) {
				/* Actual error. User is not authenticated. */
				return { user: null };
			}
			/* Redirect is thrown. */
			throw e;
		}
	},
	component: AuthComponent,
	pendingComponent: LoadingSpinner,
});

function AuthComponent() {
	const { user } = Route.useRouteContext();

	return <LoginOrRegister currentUser={user} />;
}
