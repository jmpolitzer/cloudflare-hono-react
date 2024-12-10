import { drizzle } from 'drizzle-orm/d1';
import { Hono } from 'hono';
import { notesTable } from './db/schema';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(notesTable).all();

  return c.json(result);
});

export default app