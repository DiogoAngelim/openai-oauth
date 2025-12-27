import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Drizzle ORM database client for the backend service.
 *
 * Usage:
 *   import { db } from './db/client';
 *
 * The client is configured with the schema from ./schema.
 * Requires the DATABASE_URL environment variable.
 */

/**
 * The main Drizzle database client instance.
 */
export const db = drizzle(pool, { schema });
