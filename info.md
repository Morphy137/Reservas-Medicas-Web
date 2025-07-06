# 🏗️ Arquitectura del Sistema - MediReservas

## 📋 Distribución de Componentes

Este diagrama muestra la distribución física de los componentes del sistema de reservas médicas:

### **👥 Clientes**
Pacientes, médicos y administradores, cada uno con su interfaz gráfica específica y diferenciada.

### **🌐 Servidor Web Central** 
Alberga el servidor HTTP (Node.js + Express) y gestiona las conexiones con la capa de datos.

### **🗄️ Base de Datos**
Implementada en MySQL o PostgreSQL para producción, almacena reservas, usuarios y horarios médicos.

### **📧 Servicio de Notificaciones**
Componente externo encargado de enviar recordatorios de citas via email, SMS y notificaciones push.

## 🔄 Comunicación del Sistema

La comunicación entre clientes, servidor y base de datos asegura un funcionamiento eficiente y accesible de la plataforma mediante:

- **API REST** para comunicación cliente-servidor
- **Autenticación JWT** para seguridad y roles
- **Estado sincronizado** entre frontend y backend
- **Persistencia confiable** de datos críticos

## 🛡️ Restricciones de Estado de Reservas

### **📋 Estados Permitidos:**
- **pending** (Pendiente): Estado inicial de una reserva
- **confirmed** (Confirmada): El médico/admin confirma la cita
- **cancelled** (Cancelada): Cancelada por cualquier motivo

### **🔒 Restricciones de Transición:**
1. **Pendiente → Confirmada**: ✅ **PERMITIDO**
2. **Pendiente → Cancelada**: ✅ **PERMITIDO**
3. **Confirmada → Cancelada**: ❌ **PROHIBIDO**
4. **Cancelada → Confirmada**: ❌ **PROHIBIDO**

### **🎯 Justificación:**
- Una vez confirmada una cita, no puede ser cancelada para mantener registro clínico
- Una vez cancelada una cita, no puede ser reconfirmada 
- Esto previene manipulación del historial médico
- Permite aplicar sanciones por inasistencias repetidas

### **⚙️ Implementación:**
- Función de validación `canChangeAppointmentStatus()`
- Aplicada en AdminDashboard, BookingPage y DoctorDashboard
- Mensajes de error informativos para el usuario
- UI deshabilitada para cambios no permitidos

---

**📚 Documentación Detallada:** Ver [`docs/`](./docs/) para especificaciones técnicas completas 