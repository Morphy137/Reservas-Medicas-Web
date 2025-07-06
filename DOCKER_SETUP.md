# 🐳 Docker Setup - MediReservas

## 🚀 Inicio Rápido

### **Un Solo Comando para Todo**
```bash
# Clonar y configurar
git clone <tu-repo>
cd reservas-medicas-web
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Levantar sistema completo
docker-compose up
```

**🎉 ¡Listo! Sistema completo corriendo en minutos:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:4000  
- 🗄️ **Base de Datos:** localhost:3306
- 🖥️ **Adminer (DB UI):** http://localhost:8080

---

## 🏗️ Arquitectura de Contenedores

### **Servicios Incluidos**

| Servicio | Puerto | Descripción | Healthcheck |
|----------|--------|-------------|-------------|
| `database` | 3306 | MySQL 8.0 con datos de prueba | ✅ |
| `backend` | 4000 | Node.js API + JWT | Depende de DB |
| `frontend` | 3000 | React + Nginx optimizado | Depende de API |
| `adminer` | 8080 | Interfaz web para MySQL | Depende de DB |

### **Volúmenes Persistentes**
- `mysql_data` → Datos de MySQL persisten entre reinicios
- Hot-reload activado para desarrollo

---

## 🔧 Comandos Útiles

### **Gestión Básica**
```bash
# Iniciar en background
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### **Desarrollo**
```bash
# Reconstruir contenedores
docker-compose up --build

# Reiniciar un servicio específico
docker-compose restart backend

# Ejecutar comando en contenedor
docker-compose exec backend npm run dev
docker-compose exec database mysql -u root -p
```

### **Debugging**
```bash
# Ver estado de contenedores
docker-compose ps

# Inspeccionar un contenedor
docker-compose exec backend sh

# Ver recursos utilizados
docker stats
```

---

## 🌍 Variables de Entorno

### **Backend (.env)**
```bash
PORT=4000
JWT_SECRET=tu_jwt_secret_aqui
DB_HOST=database  # Nombre del servicio Docker
DB_USER=medireservas
DB_PASSWORD=medireservas123
DB_NAME=reservas_medicas
DB_PORT=3306
```

### **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:4000
```

---

## 🏥 Datos de Prueba

### **Usuarios Precargados**
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@medireservas.com` | `admin123` |
| Doctor | `juan.perez@medireservas.com` | `doctor123` |
| Doctor | `maria.gonzalez@medireservas.com` | `doctor123` |
| Paciente | `ana.torres@email.com` | `paciente123` |

### **Datos Incluidos**
- ✅ 3 médicos con especialidades
- ✅ 2 pacientes de ejemplo
- ✅ Esquema de base de datos completo
- ✅ Configuración de roles y permisos

---

## 🔐 Seguridad

### **Características Implementadas**
- 🔒 Contraseñas hasheadas con bcrypt
- 🎫 JWT tokens con expiración
- 👥 Usuario no-root en contenedores
- 🌐 CORS configurado
- 🔧 Variables de entorno separadas

### **Para Producción**
```bash
# Usar docker-compose.prod.yml (crear si necesario)
docker-compose -f docker-compose.prod.yml up

# Variables de entorno más seguras
# Cambiar JWT_SECRET por valor aleatorio
# Usar credenciales MySQL seguras
```

---

## 🐛 Troubleshooting

### **Problemas Comunes**

#### Puerto Ocupado
```bash
# Cambiar puertos en docker-compose.yml
ports:
  - "3001:3000"  # Frontend en 3001
  - "4001:4000"  # Backend en 4001
```

#### Base de Datos No Inicia
```bash
# Limpiar volúmenes y reiniciar
docker-compose down -v
docker-compose up database
```

#### Contenedor No Conecta a BD
```bash
# Verificar healthcheck
docker-compose logs database
docker-compose ps
```

#### Reinstalación Completa
```bash
# Eliminar todo y empezar de cero
docker-compose down -v --remove-orphans
docker system prune -a
docker-compose up --build
```

---

## 📊 Monitoring

### **Ver Estado del Sistema**
```bash
# Estado de servicios
docker-compose ps

# Uso de recursos
docker stats

# Logs en tiempo real
docker-compose logs -f --tail=100
```

### **Adminer - UI Base de Datos**
- **URL:** http://localhost:8080
- **Sistema:** MySQL
- **Servidor:** database
- **Usuario:** medireservas
- **Contraseña:** medireservas123
- **Base de datos:** reservas_medicas

---

## 🎯 Próximos Pasos

1. **Desarrollo:** Modificar código y ver cambios en tiempo real
2. **Testing:** Usar datos de prueba para verificar funcionalidad
3. **Producción:** Configurar variables de entorno seguras
4. **Escalabilidad:** Agregar más servicios según necesidad

¡Tu sistema MediReservas está listo para desarrollo y producción! 🚀
