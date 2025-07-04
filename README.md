# 🏥 Reservas Médicas Web

Bienvenido al repositorio de **Reservas Médicas Web**, una plataforma moderna diseñada para facilitar la reserva y gestión de horas médicas, optimizando tanto la experiencia de los pacientes como la administración de los centros de salud.

---

## 🚀 Propósito del Proyecto

El objetivo principal de este proyecto es ofrecer una solución integral para la **reserva de horas médicas** a través de una plataforma web intuitiva, eficiente y segura. Entre sus características destacan:

- **Reserva rápida y sencilla** de citas médicas.
- **Gestión optimizada** de agendas para profesionales y centros de salud.
- Herramientas para la **notificación y recordatorio** de citas.
- Funcionalidades que mejoran la **experiencia del usuario** y la **eficiencia administrativa**.

---

## 🛠️ Herramientas y Tecnologías Utilizadas

- **React**  
  Para la construcción de una interfaz de usuario dinámica y responsiva.

- **Node.js**  
  Backend robusto para la gestión de la lógica de negocio y la conexión con bases de datos.

- **MySQL**  
  Almacenamiento seguro y eficiente de la información de usuarios, citas y médicos.

- **Firebase**  
  Utilizado para autenticación, notificaciones y servicios en tiempo real.

- **Visual Studio Code**  
  Editor de código principal para el desarrollo colaborativo.

- **Git & GitHub**  
  Control de versiones y colaboración en equipo.

---

## 📦 Estructura del Proyecto

```
/reservas-medicas-web
├── /client              # Aplicación cliente (frontend)
│   ├── /public          # Archivos estáticos públicos
│   └── /src             # Código fuente de la aplicación React
│       ├── /assets      # Imágenes, estilos y recursos estáticos
│       ├── /components  # Componentes reutilizables de React
│       ├── /pages       # Vistas o páginas principales
│       ├── /services    # Lógica para interactuar con APIs
│       └── /utils       # Funciones utilitarias y helpers
│
├── /server              # Servidor backend
│   ├── /config          # Configuraciones de la base de datos y servidor
│   ├── /controllers     # Lógica para manejar las reservas y usuarios
│   ├── /middlewares     # Middlewares para validaciones y autenticación
│   ├── /models          # Modelos de datos para la base de datos
│   ├── /routes          # Rutas de la API
│   └── /utils           # Funciones utilitarias del backend
│
├── /scripts             # Scripts para tareas comunes (p. ej., migraciones)
│
├── .gitignore           # Archivos y carpetas ignoradas por Git
├── package.json         # Dependencias y scripts del proyecto
└── README.md            # Documentación del proyecto
```

---

## � Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)
- **Git** para clonar el repositorio

---

## ⚙️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Morphy137/Reservas-Medicas-Web.git
cd Reservas-Medicas-Web
```

### 2. Instalación del Frontend

Navega a la carpeta del frontend e instala las dependencias:

```bash
cd frontend
npm install
```

#### Dependencias Principales del Frontend

El proyecto utiliza las siguientes dependencias que se instalan automáticamente con `npm install`:

- **React**: Framework principal para la interfaz de usuario
- **TypeScript**: Para tipado estático y mejor desarrollo
- **Vite**: Herramienta de build y servidor de desarrollo
- **React Router DOM**: Para la navegación entre páginas
- **Bootstrap**: Framework CSS para estilos y componentes
- **Bootstrap Icons**: Iconos de Bootstrap para la interfaz
- **React Bootstrap**: Componentes de Bootstrap para React
- **Axios**: Cliente HTTP para comunicación con el backend
- **React Icons**: Biblioteca adicional de iconos

#### Dependencia Crítica: Bootstrap Icons

⚠️ **Importante**: Si encuentras el error `Failed to resolve import "bootstrap-icons/font/bootstrap-icons.css"`, instala manualmente:

```bash
npm install bootstrap-icons
```

### 3. Instalación del Backend

Navega a la carpeta del backend e instala las dependencias:

```bash
cd ../backend
npm install
```

#### Dependencias Principales del Backend

- **Express**: Framework web para Node.js
- **bcryptjs**: Para encriptación de contraseñas
- **jsonwebtoken**: Para autenticación JWT
- **cors**: Para manejo de CORS
- **dotenv**: Para variables de entorno
- **nodemon**: Para desarrollo con hot-reload

### 4. Ejecutar el Proyecto

#### Ejecutar el Frontend

```bash
cd frontend
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173` (o el siguiente puerto disponible).

#### Ejecutar el Backend

```bash
cd backend
npm run dev
```

El servidor backend se ejecutará en el puerto configurado (generalmente 3000).

---

## 🔧 Scripts Disponibles

### Frontend

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run lint`: Ejecuta el linter para revisar el código
- `npm run preview`: Previsualiza la build de producción

### Backend

- `npm run dev`: Inicia el servidor con nodemon (hot-reload)
- `npm test`: Ejecuta las pruebas (por configurar)

---

## 🚨 Solución de Problemas Comunes

### Error: "bootstrap-icons/font/bootstrap-icons.css" no encontrado

**Solución:**
```bash
cd frontend
npm install bootstrap-icons
```

### Error: Puerto en uso

Si el puerto está ocupado, Vite automáticamente usará el siguiente disponible (ej: 5174, 5175, etc.).

### Problemas de dependencias

Si encuentras problemas con las dependencias, intenta:

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## �👥 Contribuciones

¡Toda contribución es bienvenida! Si deseas colaborar, por favor abre un issue o envía un pull request.

---

## 📄 Licencia

Este proyecto es solo para fines educativos.

---
