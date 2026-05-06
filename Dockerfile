# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Generate Prisma client and build project (frontend + server)
RUN npx prisma generate
RUN npm run build

# Final stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and compiled server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Expose port 3000 (standard for Dokploy setup)
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Start the server
CMD ["node", "server/index.js"]
