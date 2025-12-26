# NOTE: Build context must be the workspace root (openai-oauth) for COPY ../../packages/prisma to work.










# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../pnpm-lock.yaml ./
COPY ../../packages/prisma prisma
COPY . .
RUN npm install -g pnpm@8.15.5
RUN pnpm install --prod --force
RUN npx prisma generate
RUN pnpm --filter ./apps/backend... run build




# --- Production Stage ---
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY ../../packages/prisma/schema.prisma ./prisma/schema.prisma
RUN npm install -g pnpm@8.15.5
ENV npm_config_ignore_scripts=true
RUN pnpm prune --prod
EXPOSE 4000
CMD ["node", "dist/main.js"]
