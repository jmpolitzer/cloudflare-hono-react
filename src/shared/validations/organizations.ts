import { z } from "zod";

export const editOrgSchema = z.object({
	name: z.string().min(1, "Name is required"),
});

export const removeOrgUserSchema = z.object({
	userId: z.string().min(1, "User ID is required"),
});

export const updateOrgUserRolesSchema = z.object({
	currentRoleId: z.enum(["admin", "basic"]),
	newRoleId: z.enum(["admin", "basic"]),
});
