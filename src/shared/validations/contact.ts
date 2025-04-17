import { z } from "zod";

export const contactFormSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
	message: z.string().min(1, "Message is required"),
	name: z.string().min(1, "Name is required"),
	phone: z.string().min(9).max(9).optional(),
	reason: z.enum(["general", "sales", "support", "partnership"]),
});
