import UnauthenticatedLayout from "@/frontend/components/layouts/unauthenticated";
import LoadingSpinner from "@/frontend/components/ui/loading-spinner";
import { Toaster } from "@/frontend/components/ui/sonner";
import { Outlet, createFileRoute } from "@tanstack/react-router";

const Component = () => {
	return (
		<UnauthenticatedLayout>
			<Outlet />
			<Toaster />
		</UnauthenticatedLayout>
	);
};

export const Route = createFileRoute("/_unauthenticated")({
	component: Component,
	pendingComponent: LoadingSpinner,
});
