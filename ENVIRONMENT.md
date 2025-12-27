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

# Environment Variables Reference

## Backend (ECS/NestJS)
Set these in AWS Secrets Manager or ECS task definition:
- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `OPENAI_ORG_ID`
- `FRONTEND_URL`
- `BACKEND_URL`
- `NODE_ENV`
- `PORT`

## Frontend (Vercel/Next.js)
Set these in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` (should point to your backend, e.g., https://api.yourdomain.com)
- Any other public config needed by the frontend

## Notes
- Never commit secrets to git.
- Use Vercel’s dashboard for frontend, AWS Secrets Manager for backend.
- See README_DEPLOY.md for deployment steps.
