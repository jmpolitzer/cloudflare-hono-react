import { createLazyFileRoute } from "@tanstack/react-router";
import { hc } from "hono/client";
import { useEffect, useState } from "react";

import type { AppType } from "@app-types";
import type { InferResponseType } from "hono/client";

export const Route = createLazyFileRoute("/")({
	component: Index,
});

function Index() {
	const client = hc<AppType>("/");
	const getNotes = client.api.notes.$get;
	const getNote = client.api.notes[":id"].$get;

	const [notes, setNotes] = useState<InferResponseType<typeof getNotes>>();
	const [note, setNote] = useState<InferResponseType<typeof getNote>>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is necessary to avoid an infinite loop
	useEffect(() => {
		const fetchNotes = async () => {
			const res = await getNotes();
			const responseData = await res.json();

			setNotes(responseData);
		};

		const fetchNote = async () => {
			const res = await getNote({ param: { id: "1" } });
			const responseData = await res.json();

			setNote(responseData);
		};

		fetchNotes();
		fetchNote();
	}, []);

	return (
		<div className="p-2">
			<h1>My Notes</h1>
			<ul>
				{notes?.notes.map((note) => (
					<li key={note.id}>
						<p>{note.title}</p>
						<p>{note.description}</p>
					</li>
				))}
			</ul>
			{note && note.note.length > 0 ? (
				<div>
					<h1>My Single Note</h1>
					<div>
						<p>{note.note[0].title}</p>
						<p>{note.note[0].description}</p>
					</div>
				</div>
			) : null}
		</div>
	);
}
