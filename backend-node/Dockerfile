# Dockerfile para Backend Node.js
FROM node:18-bullseye-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar manifests primero para cache
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluye dev) para compilar TypeScript
RUN npm ci

# Generar cliente de Prisma (necesario para tipos en build)
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Podar dependencias de desarrollo para imagen final
RUN npm prune --omit=dev

# Exponer puerto
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["node", "dist/server.js"]
