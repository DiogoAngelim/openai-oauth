// drizzle.config.ts
// Drizzle ORM migration configuration for the backend service.

import type { Config } from 'drizzle-kit'

export default {
  schema: 'src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host:
      typeof process.env.DB_HOST === 'string' && process.env.DB_HOST !== ''
        ? process.env.DB_HOST
        : '',
    port:
      typeof process.env.DB_PORT === 'string' && process.env.DB_PORT !== ''
        ? Number(process.env.DB_PORT)
        : 5432,
    user:
      typeof process.env.DB_USER === 'string' && process.env.DB_USER !== ''
        ? process.env.DB_USER
        : '',
    password:
      typeof process.env.DB_PASSWORD === 'string' &&
        process.env.DB_PASSWORD !== ''
        ? process.env.DB_PASSWORD
        : '',
    database:
      typeof process.env.DB_NAME === 'string' && process.env.DB_NAME !== ''
        ? process.env.DB_NAME
        : '',
    ssl: process.env.DB_SSL === 'true'
  }
} satisfies Config
