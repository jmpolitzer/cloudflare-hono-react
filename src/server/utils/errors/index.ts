import { ApiError } from "@kinde/management-api-js";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { z } from "zod";

export const badRequestException = (message?: string) =>
	new HTTPException(400, { message });

export const zodBadRequestException = (error: z.ZodError) =>
	new HTTPException(400, {
		message: error.errors.map((err) => err.message).join(",\n"),
	});

export const unauthorizedRequestException = (message?: string) =>
	new HTTPException(401, { message });

export const forbiddenRequestException = (message?: string) =>
	new HTTPException(403, { message });

export const notFoundRequestException = (message?: string) =>
	new HTTPException(404, { message });

export const internalServerErrorRequestException = (message?: string) =>
	new HTTPException(500, { message });

export const unknownRequestException = (error: unknown) => {
	if (error instanceof Error) {
		return new HTTPException(500, {
			message: error.message,
		});
	}
	if (error instanceof ApiError) {
		return new HTTPException(500, {
			message: error.message,
		});
	}
};

export const errorHandler = (error: Error | HTTPException, c: Context) => {
	if (error instanceof HTTPException) {
		if (error.status === 400) {
			return c.json(
				{
					success: false,
					error: {
						message: error.message ?? "Bad Request",
						code: "BadRequest",
					},
				},
				error.status,
			);
		}

		if (error.status === 401) {
			return c.json(
				{
					success: false,
					error: {
						message: error.message ?? "Unauthorized",
						code: "Unauthorized",
					},
				},
				error.status,
			);
		}

		if (error.status === 403) {
			return c.json(
				{
					success: false,
					error: {
						message: error.message ?? "Forbidden",
						code: "Forbidden",
					},
				},
				error.status,
			);
		}

		if (error.status === 404) {
			return c.json(
				{
					success: false,
					error: {
						message: error.message ?? "Entity not found",
						code: "NotFound",
					},
				},
				error.status,
			);
		}

		if (error.status === 500) {
			return c.json(
				{
					success: false,
					error: {
						message: error.message ?? "Internal Server Error",
						code: "InternalServerError",
					},
				},
				error.status,
			);
		}
	}

	return c.json(
		{
			success: false,
			error: {
				message: "Something went wrong",
				code: "InternalServerError",
			},
		},
		500,
	);
};
