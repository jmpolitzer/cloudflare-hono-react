import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/notes/create")({
	component: CreateNote,
});

function CreateNote() {
	return <div>Create a New Note!</div>;
}
