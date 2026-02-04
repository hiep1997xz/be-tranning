# Multi-stage build for Todo Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage - use standard Debian image for better compatibility
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies (include prisma for migrations)
RUN npm ci --omit=dev

# Copy Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Create non-root user
RUN groupadd -r nodejs -g 1001 && \
    useradd -r -u 1001 -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]
