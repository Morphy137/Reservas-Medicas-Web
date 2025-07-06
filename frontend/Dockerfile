# ================================================================
# DOCKERFILE FRONTEND - REACT + VITE
# Sistema de Reservas Médicas - MediReservas
# ================================================================

# Etapa de construcción
FROM node:18-alpine as build

# Información del mantenedor
LABEL maintainer="MediReservas Team"
LABEL description="Frontend React para sistema de reservas médicas"

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir aplicación para producción
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
