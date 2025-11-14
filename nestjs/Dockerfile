FROM node:18-alpine AS builder

WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm ci

# Ahora copia todo el código Nest
COPY . .

RUN npm run build

# ────────────────────────────────────────────────
# Runtime image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
