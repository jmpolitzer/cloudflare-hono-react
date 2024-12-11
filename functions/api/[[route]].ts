import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { notes } from "../../src/resources/notes";

// Set base path for all routes
const app = new Hono().basePath("/api");

// Add route resource groups
const notesRoutes = app.route("/notes", notes);

// Export types for client
export type NotesType = typeof notesRoutes;

// Export onRequest handler for Cloudflare Functions - https://developers.cloudflare.com/pages/functions/
export const onRequest = handle(app);
