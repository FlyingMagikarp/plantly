# Build Stage
FROM node:22-alpine AS build
WORKDIR /app

# Accept build-time API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production Stage
FROM node:22-alpine AS runtime
WORKDIR /app

# Only copy necessary files for runtime
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

# Copy the build output
COPY --from=build /app/build ./build

# Environment variable for runtime (if needed by SSR server)
ENV PORT=3000
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]