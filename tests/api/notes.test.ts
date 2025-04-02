import { env as testEnv } from "cloudflare:test";
import * as schema from "@/server/db/schema";
import { createNotesRoutes } from "@/server/routes/notes";
import { errorHandler } from "@/server/utils/errors";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { describe, expect, it } from "vitest";
import {
	mockEnsureUser,
	mockGetKindeClient,
	mockNotFoundError,
} from "../vitest-setup";
import type { MockKindeClientOptions } from "../vitest-setup";

describe("Notes API Tests", () => {
	const db = drizzle(testEnv.DB, { schema });
	const setupApp = (authOptions?: MockKindeClientOptions) => {
		const notes = createNotesRoutes({
			getKindeClient: mockGetKindeClient(authOptions),
			ensureUser: mockEnsureUser,
		});

		return new Hono<{ Bindings: CloudflareBindings }>()
			.basePath("/api")
			.route("/notes", notes)
			.onError(errorHandler);
	};

	beforeEach(async () => {
		await db.delete(schema.notesTable);
	});

	it("POST /api/notes & GET /api/notes/:id - should create a note and get it", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});
		const formData = new FormData();
		formData.append("title", "Test Note");
		formData.append("description", "Test Description");
		const post = await app.request(
			"/api/notes",
			{ method: "POST", body: formData },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const postData = (await post.json()) as any;
		expect(post.status).toBe(201);

		const get = await app.request(
			`/api/notes/${postData.note.meta.last_row_id}`,
			{ method: "GET" },
			testEnv,
		);
		expect(get.status).toBe(200);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const getData = (await get.json()) as any;
		expect(getData.note).toHaveProperty("title", "Test Note");
		expect(getData.note).toHaveProperty("description", "Test Description");
		expect(getData.note).toHaveProperty("userId", "mock-user-id");
		expect(getData.note).toHaveProperty("orgId", "mock-org");
	});

	it("GET /api/notes - should get paginated notes", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		// Insert test data
		await db.insert(schema.notesTable).values([
			{ title: "Note 1", userId: "mock-user-id", orgId: "mock-org" },
			{ title: "Note 2", userId: "mock-user-id", orgId: "mock-org" },
		]);

		const response = await app.request(
			"/api/notes?page=1&limit=2",
			{ method: "GET" },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(200);
		expect(data.notes).toHaveLength(2);
		expect(data.notes[0].title).toBe("Note 1");
		expect(data.pagination).toEqual({
			total: 2,
			page: 1,
			limit: 2,
			totalPages: 1,
		});
	});

	it("GET /api/notes - should return empty list when no notes exist", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const response = await app.request(
			"/api/notes",
			{ method: "GET" },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(200);
		expect(data.notes).toHaveLength(0);
		expect(data.pagination).toEqual({
			total: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
		});
	});

	it("GET /api/notes/:noteId - should fail if note not found", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const response = await app.request(
			"/api/notes/999",
			{ method: "GET" },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(404);
		expect(data).toMatchObject(mockNotFoundError);
	});

	it("PUT /api/notes/:noteId - should update a note", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		// Create a note
		const [note] = await db
			.insert(schema.notesTable)
			.values({
				title: "Old Title",
				userId: "mock-user-id",
				orgId: "mock-org",
			})
			.returning();

		const formData = new FormData();
		formData.append("title", "New Title");
		formData.append("description", "New Description");

		const response = await app.request(
			`/api/notes/${note.id}`,
			{ method: "PUT", body: formData },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(200);
		expect(data.note).toHaveProperty("title", "New Title");
		expect(data.note).toHaveProperty("description", "New Description");
		expect(data.note).toHaveProperty("id", note.id);
	});

	it("PUT /api/notes/:noteId - should fail if note not found", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const formData = new FormData();
		formData.append("title", "New Title");

		const response = await app.request(
			"/api/notes/999",
			{ method: "PUT", body: formData },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(404);
		expect(data).toMatchObject(mockNotFoundError);
	});

	it("PUT /api/notes/:noteId - should fail with invalid form data", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const [note] = await db
			.insert(schema.notesTable)
			.values({
				title: "Old Title",
				userId: "mock-user-id",
				orgId: "mock-org",
			})
			.returning();

		const formData = new FormData();
		formData.append("title", ""); // Empty title violates schema

		const response = await app.request(
			`/api/notes/${note.id}`,
			{ method: "PUT", body: formData },
			testEnv,
		);

		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(400);
		expect(data.success).toBe(false);
		expect(data.error.name).toContain("Zod");
	});

	it("DELETE /api/notes/:noteId - should delete a note", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const [note] = await db
			.insert(schema.notesTable)
			.values({
				title: "Delete Me",
				userId: "mock-user-id",
				orgId: "mock-org",
			})
			.returning();

		const response = await app.request(
			`/api/notes/${note.id}`,
			{ method: "DELETE" },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const data = (await response.json()) as any;
		expect(response.status).toBe(200);
		expect(data).toEqual({ success: true });

		// Verify deletion
		const deletedNote = await db.query.notesTable.findFirst({
			where: eq(schema.notesTable.id, note.id),
		});
		expect(deletedNote).toBeUndefined();
	});

	it("DELETE /api/notes/:noteId - should fail if user lacks permission", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const [note] = await db
			.insert(schema.notesTable)
			.values({
				title: "Other User Note",
				userId: "other-user-id", // Different user
				orgId: "mock-org",
			})
			.returning();

		const response = await app.request(
			`/api/notes/${note.id}`,
			{ method: "DELETE" },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(404);
		expect(data.error.message).toContain(
			"Note not found or you don't have permission to delete it",
		);
	});

	it("DELETE /api/notes/:noteId - should fail if note not found", async () => {
		const app = setupApp({
			isAuthenticated: true,
			user: {
				id: "mock-user-id",
				orgCode: "mock-org",
			},
		});

		const response = await app.request(
			"/api/notes/999",
			{ method: "DELETE" },
			testEnv,
		);
		// biome-ignore lint/suspicious/noExplicitAny: <Test Env>
		const data = (await response.json()) as any;
		expect(response.status).toBe(404);
		expect(data.error.message).toContain(
			"Note not found or you don't have permission to delete it",
		);
	});
});
