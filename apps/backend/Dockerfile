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



# Copy backend source and config from root context
COPY apps/backend/src ./src
COPY apps/backend/tsconfig.json ./tsconfig.json
COPY packages/prisma ./prisma

# Generate Prisma client and build
RUN npx prisma generate --schema=prisma/schema.prisma
RUN pnpm run build





# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main.js"]
