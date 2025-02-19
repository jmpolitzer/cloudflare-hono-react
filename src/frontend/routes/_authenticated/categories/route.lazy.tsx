import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/categories")({
	component: CategoriesComponent,
});

function CategoriesComponent() {
	return <div>Categories</div>;
}
