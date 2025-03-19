import { z } from "zod";

export const noteFormSchema = z.object({
	title: z.string().min(1, "Title is required").max(255, "Title is too long"),
	description: z.string().max(10000, "Description is too long").optional(),
});
