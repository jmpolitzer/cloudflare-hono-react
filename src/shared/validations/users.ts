import { z } from "zod";

export const registerUserSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
});

export const loginUserSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
});
