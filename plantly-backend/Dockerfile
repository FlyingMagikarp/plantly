# Build stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source and config files
COPY . .

# Build the NestJS app
RUN npm run build

# Remove development dependencies to keep the production image small
# We keep them for now because we need ts-node for migrations in production if they are .ts
# RUN npm prune --production

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy production dependencies and build artifacts from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Copy docker-entrypoint.sh and ensure it's executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Environment variables (to be overridden at runtime)
ENV NODE_ENV=production \
    PORT=8081 \
    DB_PORT=5432

# Expose backend port
EXPOSE 8081

# Start via entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]
