import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import type { NotesType } from "../functions/api/[[route]]";

const App = () => {
	const client = hc<NotesType>("/");
	const getNotes = client.api.notes.$get;
	const getNote = client.api.notes[":id"].$get;

	const [data, setData] = useState<InferResponseType<typeof getNotes>>();
	const [note, setNote] = useState<InferResponseType<typeof getNote>>();

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is necessary to avoid an infinite loop
	useEffect(() => {
		const fetchNotes = async () => {
			const res = await getNotes();
			const responseData = await res.json();

			setData(responseData);
		};

		const fetchNote = async () => {
			const res = await getNote({ param: { id: "3" } });
			const responseData = await res.json();

			setNote(responseData);
		};

		fetchNotes();
		fetchNote();
	}, []);

	return (
		<div>
			<h1>My Notes</h1>
			<ul>
				{data?.notes.map((note) => (
					<li key={note.id}>
						<p>{note.title}</p>
						<p>{note.description}</p>
					</li>
				))}
			</ul>
			{note ? (
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
};

export default App;
