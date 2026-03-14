# ── Backend Dockerfile ───────────────────────────────────────────────
# Uses Node 20 LTS on Alpine for a small, production-ready image.
FROM node:20-alpine

WORKDIR /app

# Install deps first (layer-cached on unchanged package.json)
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
