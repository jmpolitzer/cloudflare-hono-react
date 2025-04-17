import {
	unknownRequestException,
	zodBadRequestException,
} from "@/server/utils/errors";
import { contactFormSchema } from "@/shared/validations/contact";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export function createContactRoutes() {
	const app = new Hono<{ Bindings: CloudflareBindings }>();
	const contact = app.post(
		"/",
		zValidator("form", contactFormSchema, (result, c) => {
			if (!result.success) {
				throw zodBadRequestException(result.error);
			}
		}),
		async (c) => {
			try {
				const formData = c.req.valid("form");

				return c.json({ contact: formData }, 201);
			} catch (error) {
				if (error instanceof HTTPException) {
					throw error;
				}

				throw unknownRequestException(error);
			}
		},
	);

	return contact;
}

export const contact = createContactRoutes();
