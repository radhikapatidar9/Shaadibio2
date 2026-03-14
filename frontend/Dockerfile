# ── Frontend Dockerfile ──────────────────────────────────────────────
# Stage 1: Build the Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source and build (needs VITE_API_URL if connecting to external backend,
# but for Docker compose we use the default fallback in emailAPI.js, or we can pass it as build arg)
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite default nginx config with our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
