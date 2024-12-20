import { Button } from "@/frontend/components/ui/button";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { getCurrentUserQueryOptions } from "../hooks/users";

const Login = () => {
	return (
		<div className="flex flex-col items-center gap-y-2">
			<p>You have to login or register</p>
			<Button asChild>
				<a href="/api/auth/login">Login</a>
			</Button>
			<Button asChild>
				<a href="/api/auth/register">Register</a>
			</Button>
		</div>
	);
};

const Component = () => {
	const { user } = Route.useRouteContext();

	if (!user) {
		return <Login />;
	}

	return <Outlet />;
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
