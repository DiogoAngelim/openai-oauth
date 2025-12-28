# NOTE: Build context must be the workspace root (openai-oauth) for all COPY commands below to work.











# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app





# Copy backend and monorepo files from root context
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json /tsconfig.json
COPY apps/backend/drizzle ./drizzle


RUN npm install -g pnpm@8.15.5 @nestjs/cli ts-node
ENV npm_config_ignore_scripts=true
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN pnpm install --force



COPY apps/backend/src ./src
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/env-check.ts ./env-check.ts
COPY apps/backend/.env ./.env

# Set dummy env vars for build/test
ENV DATABASE_URL="postgres://user:pass@localhost:5432/testdb"
ENV REDIS_URL="redis://localhost:6379"
ENV NODE_ENV="test"
ENV SENTRY_DSN="dummy_sentry_dsn"
ENV FRONTEND_URL="http://localhost:3000"
ENV JWT_SECRET="dummy_jwt_secret"
ENV GITHUB_CLIENT_ID="dummy_github_id"
ENV GITHUB_CLIENT_SECRET="dummy_github_secret"
ENV BACKEND_URL="http://localhost:4000"
ENV LINKEDIN_CLIENT_ID="dummy_linkedin_id"
ENV LINKEDIN_CLIENT_SECRET="dummy_linkedin_secret"

RUN pnpm run build





# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
