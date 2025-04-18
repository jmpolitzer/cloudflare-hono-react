import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/dashboard")({
	component: DashboardRoute,
});

function DashboardRoute() {
	return (
		<div>
			<h3 className="mt-8 scroll-m-20 font-semibold text-2xl tracking-tight">
				Dashboard
			</h3>
			<p className="leading-7 [&:not(:first-child)]:mt-6">
				This is your authenticated "home" page. Users are redirected here after
				successful login. Fill this page with summary data and actionable items.
			</p>
		</div>
	);
}
