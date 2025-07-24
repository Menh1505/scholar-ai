# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built app and public files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/.env ./

# Optional: define NODE_ENV
ENV NODE_ENV=production
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
