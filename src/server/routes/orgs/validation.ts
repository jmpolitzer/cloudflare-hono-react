import { z } from "zod";

export const editOrganizationSchema = z.object({
	name: z.string().min(1, "Name is required"),
});
