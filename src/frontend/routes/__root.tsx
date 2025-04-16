import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import type { QueryClient } from "@tanstack/react-query";
import { FullScreenError } from "../components/errors/full-screen-error";

interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
	errorComponent: ({ error, reset }) => {
		return <FullScreenError error={error} resetErrorBoundary={reset} />;
	},
});
