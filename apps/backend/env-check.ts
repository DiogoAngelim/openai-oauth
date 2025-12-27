// env-check.ts
// Fails the build if required environment variables are missing.

const requiredVars = [
  'DATABASE_URL',
  // Add other required variables here
];

const missing = requiredVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}
