# Environment Variables

This file documents the allowed environment variables for the project. Only the following variables should be used in `.env` files:

## Required
- `DATABASE_URL` - PostgreSQL connection string for Prisma
- `JWT_SECRET` - Secret for JWT authentication
- `OPENAI_API_KEY` - OpenAI API key
- `REDIS_URL` - Redis connection string

## Optional
- `SENTRY_DSN` - Sentry DSN for error tracking
- `NODE_ENV` - Node environment (development, production, test)
- `PORT` - Port for backend server (default: 3000)
- `FRONTEND_URL` - URL for the frontend app
- `BACKEND_URL` - URL for the backend app

> **Note:** Do not add other variables unless explicitly required by the codebase.
