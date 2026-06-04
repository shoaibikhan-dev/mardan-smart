# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /usr/src/app

# Copy only package files for better cache utilization
COPY package*.json ./

# Install ONLY production dependencies — skips devDependencies (e.g. nodemon)
RUN npm ci --omit=dev && npm cache clean --force

# ── Stage 2: Production Image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Install dumb-init for proper signal handling in containers
RUN apk add --no-cache dumb-init

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001

WORKDIR /usr/src/app

# Copy installed production modules from deps stage
COPY --from=deps --chown=nodeuser:nodejs /usr/src/app/node_modules ./node_modules

# Copy application source (excludes files in .dockerignore)
COPY --chown=nodeuser:nodejs . .

# Create uploads directory and give ownership to nodeuser
RUN mkdir -p /usr/src/app/uploads && chown -R nodeuser:nodejs /usr/src/app/uploads

# Switch to non-root user
USER nodeuser

# Expose application port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Use dumb-init to handle PID 1 signals correctly (graceful shutdowns)
CMD ["dumb-init", "node", "server.js"]
