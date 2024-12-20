import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { routeTree } from "./frontend/routeTree.gen";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient();
const router = createRouter({ routeTree, context: { queryClient } });
const rootElement = document.getElementById("root");

if (!rootElement?.innerHTML) {
	// biome-ignore lint/style/noNonNullAssertion: Needed with strict:true
	const root = ReactDOM.createRoot(rootElement!);

	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	);
}
