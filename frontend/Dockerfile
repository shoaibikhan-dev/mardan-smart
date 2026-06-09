# ── Stage 1: Build the React Application ──
FROM node:20-alpine AS build

WORKDIR /app

# Copy package config and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the production bundle via Vite
RUN npm run build

# ── Stage 2: Serve via Nginx ──────────────
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
