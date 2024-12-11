import type { InferResponseType } from "hono/client";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import type { NotesType } from "../functions/api/[[route]]";

const App = () => {
	// TODO: Replace the URL with the URL of your deployed API
	const client = hc<NotesType>("http://localhost:8788/");
	const $get = client.api.notes.$get;

	const [data, setData] = useState<InferResponseType<typeof $get>>();

	useEffect(() => {
		const fetchData = async () => {
			const res = await $get();
			const responseData = await res.json();

			setData(responseData);
		};
		fetchData();
	}, [$get]);

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
		</div>
	);
};

export default App;
