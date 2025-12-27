import { pgTable, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Drizzle ORM table definitions for the backend service.
 *
 * Add new tables here using Drizzle's type-safe schema API.
 *
 * @see https://orm.drizzle.team/docs/overview
 */

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/**
 * Users table definition.
 * SQL table name: users
 */
