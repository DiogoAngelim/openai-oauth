// env-check.ts
// Fails the build if required environment variables are missing.
import 'dotenv/config'

// Skip check in CI environments (e.g., GitHub Actions)
if (
  typeof process.env.GITHUB_ACTIONS !== 'string' ||
  process.env.GITHUB_ACTIONS === ''
) {
  const requiredVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'NODE_ENV',
    'SENTRY_DSN',
    'FRONTEND_URL',
    'JWT_SECRET',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'BACKEND_URL',
    'LINKEDIN_CLIENT_ID',
    'LINKEDIN_CLIENT_SECRET'
  ]
  const missing = requiredVars.filter(
    (v) => typeof process.env[v] !== 'string' || process.env[v] === ''
  )
  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(', ')}`
    )
    process.exit(1)
  }
}

// Handle nullable/empty strings explicitly
const envVar = process.env.YOUR_ENV_VAR_NAME
if (typeof envVar === 'string' && envVar !== '') {
  // valid
}
