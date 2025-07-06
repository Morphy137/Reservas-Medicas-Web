# 🔧 Documentación Técnica - MediReservas

## 📋 Resumen de Implementación

Esta documentación técnica consolida la información de implementación del sistema MediReservas, incluyendo la conexión frontend-backend, arquitectura de autenticación y especificaciones técnicas.

---

## 🏗️ Arquitectura del Sistema

### **🌐 Frontend-Backend Integration**

#### **Stack Completo**
- **Frontend:** React 18 + TypeScript + Vite (Puerto 5173)
- **Backend:** Node.js + Express (Puerto 4000)
- **Base de Datos:** MySQL 8.0 (Puerto 3306)
- **Autenticación:** JWT con roles diferenciados
- **Comunicación:** API REST con axios
- **Estado:** Context API + localStorage
- **Containerización:** Docker + Docker Compose
- **Servidor Web:** Nginx para producción

#### **Flujo de Comunicación**
```
Cliente React (3000/5173) ←→ API Express (4000) ←→ MySQL (3306)
         ↑                          ↑                    ↑
    Nginx (Prod)              JWT Auth            Inicialización
```

---

## 🐳 Arquitectura Docker

### **🏗️ Servicios Containerizados**

#### **docker-compose.yml**
```yaml
services:
  database:     # MySQL 8.0 con datos de prueba
  backend:      # Node.js API + JWT + CORS
  frontend:     # React + Nginx optimizado
  adminer:      # UI para gestión de BD
```

#### **Características Docker**
- ✅ **Inicialización automática** de base de datos
- ✅ **Datos de prueba** precargados
- ✅ **Healthchecks** para dependencias
- ✅ **Volúmenes persistentes** para MySQL
- ✅ **Hot-reload** en desarrollo
- ✅ **Nginx optimizado** para React SPA
- ✅ **Variables de entorno** configurables

### **🚀 Deployment Ready**

#### **Contenedores de Producción**
- **Frontend:** React build + Nginx Alpine
- **Backend:** Node.js 18 Alpine con usuario no-root
- **Database:** MySQL 8.0 con configuración optimizada
- **Reverse Proxy:** Nginx con compresión gzip y headers de seguridad

#### **Comandos Docker**
```bash
# Desarrollo completo
docker-compose up

# Producción
docker-compose -f docker-compose.prod.yml up

# Rebuild completo
docker-compose up --build
```

---

## 🔐 Sistema de Autenticación

### **🎯 Usuarios de Prueba**
| Rol | Email | Contraseña | Permisos |
|-----|-------|------------|----------|
| 👨‍⚕️ Doctor | `doctor@test.com` | `123456` | Dashboard médico, gestión citas |
| 👤 Paciente | `paciente@test.com` | `123456` | Reservas, ver médicos |
| ⚙️ Admin | `admin@test.com` | `123456` | CRUD completo, gestión global |

### **🛡️ Características de Seguridad**

#### **Backend Security**
- ✅ Contraseñas hasheadas con `bcryptjs`
- ✅ Tokens JWT con expiración de 24 horas
- ✅ CORS configurado para origen específico
- ✅ Middleware de autenticación en rutas protegidas
- ✅ Validación de roles por endpoint
- ✅ Manejo global de errores

#### **Frontend Security**
- ✅ Tokens almacenados en localStorage
- ✅ Headers de autorización automáticos
- ✅ Limpieza de sesión en logout
- ✅ Rutas protegidas con `ProtectedRoute`
- ✅ Verificación de roles en UI
- ✅ Redirección automática según permisos

---

## 🛣️ Rutas y Permisos

### **🌍 Rutas Públicas**
```typescript
/ (HomePage)           // Acceso libre
/login (LoginPage)     // Acceso libre
```

### **🔒 Rutas Protegidas**
```typescript
/doctors               // Todos los usuarios autenticados
/book/:doctorId       // Solo pacientes y admin
/dashboard            // Solo doctores y admin  
/admin                // Solo admin
```

### **🎯 Lógica de Redirección**
- **Post-login:** Automático según rol del usuario
- **Acceso denegado:** Redirect a `/login`
- **Rutas inexistentes:** 404 con navegación

---

## 🌐 API Endpoints

### **🔐 Autenticación (`/api/auth`)**
```javascript
POST   /login          // Iniciar sesión → JWT token
POST   /register       // Registrar usuario (simulado)
GET    /verify         // Verificar validez token
POST   /logout         // Cerrar sesión (protegido)
```

### **📊 Sistema General (`/api`)**
```javascript
GET    /health         // Estado del servidor
GET    /test-users     // Lista usuarios prueba
GET    /appointments   // Citas médicas (protegido)
```

### **📋 Respuestas API**
```json
// Login exitoso
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "doctor@test.com", 
    "role": "doctor",
    "name": "Dr. Juan Pérez"
  }
}

// Error de autenticación
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

## 💻 Componentes Clave

### **🔐 AuthContext (`context/AuthContext.tsx`)**
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

### **🛡️ ProtectedRoute (`components/ProtectedRoute.tsx`)**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
}
```

### **🌐 API Service (`services/api.ts`)**
```typescript
// Configuración automática de headers JWT
const apiService = {
  login: (credentials) => POST /auth/login,
  getAppointments: () => GET /appointments (with JWT),
  // ... otros métodos
}
```

---

## 🎨 Implementación UI/UX

### **🎯 Navegación Inteligente**
- **NavigationBar:** Menús condicionales por rol
- **Redirects:** Automáticos post-autenticación
- **Loading States:** Spinners durante operaciones async
- **Error Handling:** Mensajes informativos al usuario

### **📱 Responsive Design**
- **Mobile-first:** Diseño adaptable desde 320px
- **Breakpoints:** SM (640px), MD (768px), LG (1024px)
- **Glass-morphism:** Efectos modernos con backdrop-blur
- **Gradientes:** Consistencia visual en todo el sistema

---

## 🔧 Configuración de Desarrollo

### **📦 Dependencias Críticas**

#### **Frontend**
```json
{
  "react": "^18.x",
  "typescript": "^5.x", 
  "vite": "^5.x",
  "react-router-dom": "^6.x",
  "react-icons": "^5.x"
}
```

#### **Backend**
```json
{
  "express": "^4.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "cors": "^2.x",
  "nodemon": "^3.x"
}
```

### **⚙️ Variables de Entorno**
```bash
# Backend (.env)
JWT_SECRET=your_jwt_secret_here
PORT=4000
NODE_ENV=development

# Frontend (automático)
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Comandos de Desarrollo

### **🎨 Frontend**
```powershell
cd frontend
npm install          # Instalar dependencias
npm run dev          # Servidor desarrollo (5173)
npm run build        # Build producción
npm run preview      # Preview build
```

### **⚙️ Backend**
```powershell
cd backend  
npm install          # Instalar dependencias
npm run dev          # Servidor con nodemon (4000)
npm start           # Servidor producción
```

---

## 🧪 Testing y Calidad

### **✅ Pruebas Implementadas**
- **Backend:** Endpoints manuales con archivos JSON
- **Frontend:** Flujos de usuario completos
- **Integración:** Autenticación end-to-end
- **UI:** Responsive en múltiples dispositivos

### **📋 Archivos de Prueba**
```
backend/
├── test-login.json      # Credenciales válidas
├── test-register.json   # Registro de usuarios  
├── test-patient.json    # Flujos de paciente
└── PRUEBAS_BACKEND.md   # Documentación testing
```

---

## 🚨 Troubleshooting

### **❌ Errores Comunes**

#### **CORS Error**
```bash
# Verificar configuración en backend/src/index.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

#### **JWT Token Invalid**
```javascript
// Limpiar localStorage si hay tokens corruptos
localStorage.removeItem('token');
localStorage.removeItem('user');
```

#### **Puerto en Uso**
```powershell
# Frontend: Vite cambia automáticamente a 5174, 5175...
# Backend: Modificar PORT en .env o src/index.js
```

---

## 📊 Métricas de Rendimiento

### **⏱️ Tiempos de Respuesta**
- **Login:** < 100ms (simulado)
- **Load de páginas:** < 2s (dev mode)
- **API calls:** < 50ms (local)
- **Build time:** ~10s (frontend)

### **📈 Compatibilidad**
- **Navegadores:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos:** Desktop, tablet, mobile (320px+)
- **OS:** Windows, macOS, Linux

---

## 🎯 Próximos Pasos Técnicos

### **🔄 Refactoring Sugerido**
1. **Base de datos real:** PostgreSQL con Prisma ORM
2. **Testing automatizado:** Jest + React Testing Library  
3. **CI/CD pipeline:** GitHub Actions
4. **Monitoreo:** Logging estructurado
5. **Cache:** Redis para sesiones
6. **Security:** Rate limiting, sanitización

### **🚀 Optimizaciones**
1. **Code splitting:** Lazy loading de rutas
2. **Bundle optimization:** Tree shaking
3. **Image optimization:** WebP, lazy loading
4. **PWA features:** Service workers
5. **SEO:** Meta tags dinámicos

---

**📋 Estado:** Implementación completa para prototipo funcional  
**✅ Listo para:** Demostración, evaluación académica  
**🔄 Pendiente:** Migración a producción con BD real
