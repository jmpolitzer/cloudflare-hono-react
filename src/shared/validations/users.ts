import { z } from "zod";

export const inviteUserSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
});

const orgName = z.object({
	orgName: z.string().min(1, "Organization name is required"),
});

export const registerUserSchema = z
	.object({
		email: z
			.string()
			.min(1, "Email is required")
			.email("This is not a valid email"),
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
	})
	.merge(orgName);

export const loginUserSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
});
