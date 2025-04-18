import { z } from "zod";

const optionalOrgIdSchema = z.object({
	orgId: z.string().optional(),
});

const requiredOrgIdSchema = z.object({
	orgId: z.string(),
});

const emailSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("This is not a valid email"),
});

const orgNameSchema = z.object({
	orgName: z.string().min(1, "Organization name is required"),
});

export const editUserSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
});

export const loginUserSchema = z
	.object({})
	.merge(emailSchema)
	.merge(optionalOrgIdSchema);

export const registerUserSchema = z
	.object({})
	.merge(emailSchema)
	.merge(orgNameSchema)
	.merge(editUserSchema);

export const inviteUserSchema = z
	.object({})
	.merge(emailSchema)
	.merge(requiredOrgIdSchema)
	.merge(orgNameSchema)
	.merge(editUserSchema);
