import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/account")({
	component: AccountComponent,
});

function AccountComponent() {
	return <div>My Account!</div>;
}
