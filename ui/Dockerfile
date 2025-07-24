# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm i

# Copy all source code
COPY . .

# Set production mode explicitly
ENV NODE_ENV=production

# Build with standalone output
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine AS runner

# Set working dir
WORKDIR /app

# Copy standalone output from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Optional: set environment
ENV NODE_ENV=production

# Expose port (Next.js default)
EXPOSE 30009

# Start the app
CMD ["node", "server.js"]
