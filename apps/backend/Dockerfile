# NOTE: Build context must be the workspace root (openai-oauth) for all COPY commands below to work.











# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app



# Copy backend and monorepo files from root context
COPY apps/backend/package.json ./package.json
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./


# Install only backend dependencies and nestjs/cli
RUN npm install -g pnpm@8.15.5 @nestjs/cli
ENV npm_config_ignore_scripts=true
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN pnpm install --prod --force



COPY apps/backend/src ./src
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY apps/backend/env-check.ts ./env-check.ts
COPY apps/backend/.env ./.env
ARG DATABASE_URL
ARG REDIS_URL
ARG NODE_ENV
ARG SENTRY_DSN
ARG FRONTEND_URL
ARG JWT_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG BACKEND_URL
ARG LINKEDIN_CLIENT_ID
ARG LINKEDIN_CLIENT_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV REDIS_URL=$REDIS_URL
ENV NODE_ENV=$NODE_ENV
ENV SENTRY_DSN=$SENTRY_DSN
ENV FRONTEND_URL=$FRONTEND_URL
ENV JWT_SECRET=$JWT_SECRET
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV BACKEND_URL=$BACKEND_URL
ENV LINKEDIN_CLIENT_ID=$LINKEDIN_CLIENT_ID
ENV LINKEDIN_CLIENT_SECRET=$LINKEDIN_CLIENT_SECRET

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
