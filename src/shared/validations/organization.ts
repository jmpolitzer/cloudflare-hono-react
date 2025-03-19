import { z } from "zod";

export const editOrgSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

export const inviteUserToOrgSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
});

export const removeOrgUserSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

export const updateOrgUserRolesSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
	currentRoleId: z.enum(["admin", "basic"]),
	newRoleId: z.enum(["admin", "basic"]),
});
