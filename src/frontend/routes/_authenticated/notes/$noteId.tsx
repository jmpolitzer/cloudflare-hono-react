import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/notes/$noteId")({
	loader: ({ params: { noteId } }) => ({
		crumb: noteId,
	}),
	validateSearch: (search: Record<string, unknown>) => {
		const result = z
			.object({
				mode: z.enum(["view", "edit"]).optional().default("view"),
			})
			.safeParse(search);

		if (!result.success) {
			return { mode: "view" };
		}

		return result.data;
	},
});
