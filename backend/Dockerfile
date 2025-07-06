# ================================================================
# DOCKERFILE BACKEND - NODE.JS
# Sistema de Reservas Médicas - MediReservas
# ================================================================

FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="MediReservas Team"
LABEL description="Backend API para sistema de reservas médicas"

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para desarrollo)
RUN npm ci

# Copiar código fuente
COPY . .

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar propietario de archivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer puerto
EXPOSE 4000

# Comando por defecto
CMD ["npm", "start"]
