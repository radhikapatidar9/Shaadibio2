# ── Multi-Stage Dockerfile for Render (Unified Build) ──
# This Dockerfile builds the React frontend and serves it via the Node.js backend.
# This allows for a single "Web Service" deployment on Render.

# Stage 1: Build the Frontend
FROM node:20-alpine AS builder
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ ./
# We can pass VITE_API_URL as a build argument. 
# For a unified build, it can often be left empty to use relative paths.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Final Production Image
FROM node:20-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=builder /app/frontend/dist ./frontend/dist

# Set environment variables
ENV NODE_ENV=production

# Expose a default port (Render will inject $PORT at runtime)
EXPOSE 10000

# Start the server
CMD ["node", "backend/server.js"]
