FROM node:20-alpine AS builder

# Set environment variables
ENV NODE_ENV=development
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Add a work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# switch to production mode
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Expose the port
EXPOSE 8080

# Start the production server
CMD ["node", "server.js"]
