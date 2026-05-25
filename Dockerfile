# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies required for the build step)
RUN npm ci || npm install

# Copy the entire workspace files
COPY . .

# Run the build (Vite static build + esbuild server compilation)
RUN npm run build

# Stage 2: Slim run-time production image
FROM node:20-alpine

# Use the pre-existing 'node' non-root user for security (Hugging Face standard UID 1000)
WORKDIR /home/node/app

# COPY package.json for production installations and set correct permissions
COPY --chown=node:node package.json package-lock.json* ./

# Install only run-time production dependencies (Express, GoogleGenAI SDK, etc.)
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the pre-compiled output from the builder stage with correct ownership
COPY --chown=node:node --from=builder /app/dist ./dist

# Set standard port configuration for Hugging Face Spaces Docker (port 7860 is default)
ENV PORT=7860
ENV NODE_ENV=production
EXPOSE 7860

# CMD to initiate the production server
CMD ["node", "dist/server.cjs"]
