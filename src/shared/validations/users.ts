import { z } from "zod";

export const loginUserSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
});

export const editUserSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
});

export const inviteUserSchema = z
	.object({})
	.merge(loginUserSchema)
	.merge(editUserSchema);

const orgNameSchema = z.object({
	orgName: z.string().min(1, "Organization name is required"),
});

export const registerUserSchema = z
	.object({})
	.merge(inviteUserSchema)
	.merge(orgNameSchema);
