# Build Stage
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++ gcc libc-dev

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY src ./src

RUN npm run build

RUN npm prune --production

# Production Stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

RUN mkdir -p /app/data && chown -R node:node /app/data

USER node

ENV PORT=4000
ENV NODE_ENV=production
ENV DB_PATH=/app/data/tasks.sqlite

EXPOSE 4000

CMD ["node", "dist/server.js"]
