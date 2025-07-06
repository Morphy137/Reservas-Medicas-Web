# 🏥 MediReservas - Sistema de Reservas Médicas

**Plataforma web moderna y profesional** para la gestión integral de reservas médicas, desarrollada con React y Node.js. Sistema completo con interfaces diferenciadas para pacientes, médicos y administradores.

[![Estado del Proyecto](https://img.shields.io/badge/Estado-85%25%20Completo-brightgreen)](./ESTADO_PROYECTO.md)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](./backend)
[![Documentación](https://img.shields.io/badge/Documentación-Completa-yellow)](./docs)

---

## 🚀 Características Principales

### ✅ **Sistema Completo Implementado**
- **🏠 Página de inicio** moderna con navegación profesional
- **🔐 Autenticación JWT** con roles diferenciados (paciente, médico, admin)
- **📅 Gestión de reservas** con estados y restricciones de negocio
- **👨‍⚕️ Dashboard médico** con horario semanal interactivo
- **⚙️ Panel administrativo** completo con CRUD de médicos y reservas
- **📱 Diseño responsive** optimizado para todos los dispositivos

### 🎯 **Funcionalidades por Rol**
- **👤 Pacientes:** Reservar citas, ver médicos disponibles, gestionar reservas
- **👨‍⚕️ Médicos:** Dashboard personal, gestión de citas, horario semanal
- **🔧 Administradores:** CRUD completo, gestión global, reportes

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 18** + **TypeScript** - Framework principal
- **Vite** - Herramienta de desarrollo y build
- **CSS3** con gradientes modernos y glass-morphism
- **React Router** - Navegación y rutas protegidas
- **React Icons** - Iconografía profesional
- **Context API** - Gestión de estado global

### **Backend**
- **Node.js** + **Express.js** - Servidor HTTP
- **JWT** - Autenticación y autorización
- **bcryptjs** - Encriptación de contraseñas
- **CORS** - Configuración de origen cruzado
- **Nodemon** - Desarrollo con hot-reload

### **Desarrollo**
- **Git & GitHub** - Control de versiones
- **VS Code** - Entorno de desarrollo
- **ESLint** - Linting y calidad de código
- **PowerShell** - Terminal para Windows

---

## 📦 Estructura del Proyecto

```
📂 MediReservas/
├── 📄 README.md                    # Documentación principal
├── 📄 ESTADO_PROYECTO.md           # Estado y análisis completo
├── 📄 package.json                 # Configuración del workspace
├── 📁 frontend/                    # Aplicación React (Cliente)
│   ├── 📄 index.html               # Punto de entrada HTML
│   ├── 📄 package.json             # Dependencias frontend
│   ├── 📄 vite.config.ts           # Configuración Vite
│   ├── 📁 public/                  # Recursos estáticos
│   │   ├── 🎨 medical-favicon.svg  # Favicon personalizado
│   │   └── 🖼️ bg_home.jpeg         # Imagen de fondo
│   └── 📁 src/                     # Código fuente React
│       ├── 📄 App.tsx              # Componente principal + rutas
│       ├── 📄 main.tsx             # Punto de entrada React
│       ├── 📁 components/          # Componentes reutilizables
│       │   ├── 🧭 NavigationBar.tsx
│       │   ├── 🏠 HeroBanner.tsx
│       │   ├── 🛡️ ProtectedRoute.tsx
│       │   └── 📝 TestimonialSection.tsx
│       ├── 📁 pages/               # Páginas principales
│       │   ├── 🏠 HomePage.tsx
│       │   ├── 🔐 LoginPage.tsx
│       │   ├── 📅 BookingPage.tsx
│       │   ├── 👨‍⚕️ DoctorDashboard.tsx
│       │   ├── 📋 DoctorListPage.tsx
│       │   └── ⚙️ AdminDashboard.tsx
│       ├── 📁 context/             # Estado global
│       │   └── 🔐 AuthContext.tsx
│       ├── 📁 hooks/               # Hooks personalizados
│       │   └── 🔑 useAuth.ts
│       ├── 📁 services/            # APIs y servicios
│       │   └── 🌐 api.ts
│       └── 📁 styles/              # Estilos globales
│           └── 🎨 global.css
├── 📁 backend/                     # Servidor Node.js
│   ├── 📄 package.json             # Dependencias backend
│   ├── 📄 PRUEBAS_BACKEND.md       # Documentación de testing
│   └── 📁 src/                     # Código fuente Node.js
│       ├── 📄 index.js             # Servidor principal
│       ├── 📁 config/              # Configuraciones
│       │   └── 🗄️ database.js
│       ├── 📁 controllers/         # Lógica de negocio
│       │   └── 🔐 authController.js
│       ├── 📁 middlewares/         # Middlewares
│       │   └── 🛡️ authMiddleware.js
│       ├── 📁 models/              # Modelos de datos
│       │   └── 👤 User.js
│       └── 📁 routes/              # Rutas de API
│           └── 🌐 auth.js
└── 📁 docs/                        # Documentación técnica
    ├── 📄 DASHBOARD_DOCTOR_COMPLETO.md
    ├── 📄 DISEÑO_LOGIN_RENOVADO.md
    └── 📄 CONEXION_IMPLEMENTADA.md
```

---

## 🎯 Demo y Credenciales de Prueba

### **🌐 URLs del Sistema**
- **Frontend:** `http://localhost:5173` (Vite dev server)
- **Backend:** `http://localhost:4000` (Express server)

### **👤 Usuarios de Prueba**

| Rol | Email | Contraseña | Acceso |
|-----|-------|------------|--------|
| 👨‍⚕️ **Doctor** | `doctor@test.com` | `123456` | Dashboard médico, gestión de citas |
| 👤 **Paciente** | `paciente@test.com` | `123456` | Reservas, listado médicos |
| ⚙️ **Admin** | `admin@test.com` | `123456` | Panel completo, CRUD, reportes |

### **🎮 Flujo de Prueba Recomendado**
1. **Inicia como Admin** → Gestiona médicos y reservas
2. **Cambia a Paciente** → Reserva una cita médica  
3. **Accede como Doctor** → Revisa dashboard y citas asignadas

---

## 🚀 Instalación y Ejecución

### **📋 Requisitos Previos**
- **Node.js** (versión 18 o superior) ✅
- **npm** (incluido con Node.js) ✅
- **Git** para clonar el repositorio ✅
- **PowerShell** o terminal compatible ✅

### **⬇️ 1. Clonar el Repositorio**
```powershell
git clone https://github.com/usuario/reservas-medicas-web.git
cd "Reservas Medicas Web"
```

### **🎨 2. Configurar Frontend**
```powershell
cd frontend
npm install
npm run dev
```
**✅ Frontend corriendo en:** `http://localhost:5173`

### **⚙️ 3. Configurar Backend**
```powershell
# En una nueva terminal
cd backend
npm install
npm run dev
```
**✅ Backend corriendo en:** `http://localhost:4000`

### **🎯 4. Acceder al Sistema**
1. Abre tu navegador en `http://localhost:5173`
2. Usa las credenciales de prueba para hacer login
3. Explora las diferentes funcionalidades según el rol

---

## 📱 Funcionalidades Implementadas

### **🏠 Página de Inicio**
- ✅ Hero banner moderno con gradientes
- ✅ Navegación profesional responsive
- ✅ Sección de testimonios
- ✅ Footer informativo
- ✅ Integración completa con sistema de autenticación

### **🔐 Sistema de Autenticación**
- ✅ Login/logout con JWT
- ✅ Roles diferenciados (paciente, médico, admin)
- ✅ Rutas protegidas por rol
- ✅ Persistencia de sesión
- ✅ Redirects automáticos según rol

### **👤 Panel de Paciente**
- ✅ Visualización de médicos disponibles
- ✅ Sistema de reservas de citas
- ✅ Gestión de reservas personales
- ✅ Estados de reserva (pendiente, confirmada, cancelada)
- ✅ Restricciones de negocio implementadas

### **👨‍⚕️ Dashboard Médico**
- ✅ Horario semanal interactivo
- ✅ Vista de citas por día
- ✅ Información detallada de pacientes
- ✅ Gestión de estados de citas
- ✅ Estadísticas básicas (confirmadas, pendientes)

### **⚙️ Panel Administrativo**
- ✅ CRUD completo de médicos
- ✅ Gestión global de reservas
- ✅ Interface con pestañas organizadas
- ✅ Modales de confirmación profesionales
- ✅ Validaciones de negocio integradas
- ✅ Persistencia con localStorage

### **🎨 Experiencia de Usuario**
- ✅ Diseño moderno con gradientes unificados
- ✅ Glass-morphism y efectos visuales
- ✅ Animaciones suaves y micro-interacciones
- ✅ Responsive design optimizado
- ✅ Iconografía profesional consistente

---

## 🔧 Scripts Disponibles

### **Frontend (React + Vite)**
```powershell
npm run dev      # 🚀 Servidor de desarrollo
npm run build    # 📦 Build para producción  
npm run preview  # 👁️ Previsualizar build
npm run lint     # 🔍 Linting con ESLint
```

### **Backend (Node.js + Express)**
```powershell
npm run dev      # 🚀 Servidor con nodemon (hot-reload)
npm start        # ▶️ Servidor de producción
npm test         # 🧪 Ejecutar tests (configurar)
```

---

## 🎯 Restricciones de Negocio

### **📋 Estados de Reservas**
- **Pendiente** → **Confirmada** ✅
- **Pendiente** → **Cancelada** ✅  
- **Confirmada** → **Cancelada** ❌ **PROHIBIDO**
- **Cancelada** → **Confirmada** ❌ **PROHIBIDO**

### **🛡️ Validaciones Implementadas**
- Una vez confirmada, la cita no puede cancelarse
- Una vez cancelada, la cita no puede reconfirmarse
- Previene manipulación del historial médico
- UI deshabilita opciones no permitidas
- Mensajes informativos para el usuario

*Documentación completa en: [`info.md`](./info.md)*

---

## 🚨 Solución de Problemas

### **❌ Error: Puerto en uso**
```powershell
# Vite usa automáticamente el siguiente puerto disponible
# Frontend: 5173 → 5174 → 5175...
# Backend: 4000 es configurable en src/index.js
```

### **❌ Error: Dependencias**
```powershell
# Limpiar caché y reinstalar
npm cache clean --force
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### **❌ Error: CORS o conexión backend**
- ✅ Verifica que el backend esté corriendo en puerto 4000
- ✅ Revisa la configuración CORS en `backend/src/index.js`
- ✅ Confirma que el frontend apunte a la URL correcta del backend

### **❌ Error: Autenticación**
- ✅ Usa las credenciales exactas de prueba documentadas
- ✅ Limpia localStorage del navegador si hay problemas de sesión
- ✅ Verifica que el token JWT esté siendo enviado correctamente

---

## 📊 Estado del Proyecto

### **✅ Completamente Implementado (85%)**
- [x] Frontend React completo y funcional
- [x] Backend básico con autenticación JWT
- [x] Sistema de roles y permisos
- [x] Interfaces para todos los tipos de usuario
- [x] Restricciones de negocio implementadas
- [x] Diseño moderno y responsive
- [x] Navegación protegida y fluida

### **⚠️ Simulado para Desarrollo**
- [x] Datos de médicos y reservas (localStorage)
- [x] Usuarios de prueba hardcodeados
- [x] Notificaciones básicas en UI

### **❌ Pendiente para Producción**
- [ ] Base de datos real (PostgreSQL/MySQL)
- [ ] Servicios de notificación externos
- [ ] Integración con sistemas de salud
- [ ] Testing automatizado completo

*Análisis detallado en: [`ESTADO_PROYECTO.md`](./ESTADO_PROYECTO.md)*

---

## 📚 Documentación Adicional

### **📖 Documentos Principales**
- [`ESTADO_PROYECTO.md`](./ESTADO_PROYECTO.md) - Estado completo y roadmap
- [`backend/PRUEBAS_BACKEND.md`](./backend/PRUEBAS_BACKEND.md) - Testing de APIs
- [`info.md`](./info.md) - Arquitectura y reglas de negocio

### **🔧 Documentación Técnica**
- [`docs/DASHBOARD_DOCTOR_COMPLETO.md`](./docs/) - Implementación dashboard médico
- [`docs/DISEÑO_LOGIN_RENOVADO.md`](./docs/) - Mejoras de diseño de login
- [`docs/CONEXION_IMPLEMENTADA.md`](./docs/) - Integración frontend-backend

### **🎯 Para Desarrolladores**
```powershell
# Estructura de archivos clave
frontend/src/App.tsx          # Rutas principales y autenticación
frontend/src/services/api.ts  # Cliente HTTP y endpoints
backend/src/index.js          # Servidor Express y configuración
backend/src/controllers/      # Lógica de negocio
```

---

## 👥 Contribuciones y Desarrollo

### **🔧 Configuración de Desarrollo**
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: descripción del cambio'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### **📝 Convenciones de Código**
- **Commits:** Conventional Commits (feat, fix, docs, style, refactor)
- **Código:** ESLint configurado para TypeScript y React
- **Estilos:** CSS modular con variables globales
- **Componentes:** PascalCase para componentes React

---

## 📄 Información del Proyecto

**🎓 Proyecto Académico:** Fundamentos de Ingeniería de Software  
**🏫 Universidad:** Universidad de Valparaíso  
**📅 Periodo:** Semestre 1 - 2025  
**👨‍💻 Desarrollador:** Morphy  
**📧 Email:** [contacto académico]  

### **� Licencia**
Este proyecto es desarrollado con fines educativos y académicos.

---

**🚀 ¡El sistema está listo para demostración y evaluación!**

*Para preguntas técnicas o sugerencias, revisa la documentación adicional o contacta al desarrollador.*
