/**
 * MediReservas - Servidor Backend Principal
 * Sistema de reservas médicas con autenticación JWT y gestión de citas
 * @version 1.0.0
 * @author MediReservas Team
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection, initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS para desarrollo
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/api/auth', authRoutes);

/**
 * Datos de ejemplo para el dashboard médico
 * TODO: Migrar a base de datos real en producción
 * 
 * Estructura de citas médicas con información completa para pruebas del sistema.
 * Incluye pacientes de ejemplo distribuidos a lo largo de la semana para demostrar
 * la funcionalidad del dashboard semanal interactivo.
 */
const sampleAppointments = [
    {
        id: 1,
        doctorEmail: 'doctor@test.com',
        patientName: 'Ana Martínez',
        patientPhone: '+56 9 1234 5678',
        date: '2025-07-07', // Lunes
        time: '09:00',
        duration: 30,
        type: 'Consulta General',
        status: 'confirmed'
    },
    {
        id: 2,
        doctorEmail: 'doctor@test.com',
        patientName: 'Carlos Rodríguez',
        patientPhone: '+56 9 8765 4321',
        date: '2025-07-07', // Lunes
        time: '10:30',
        duration: 45,
        type: 'Control',
        status: 'confirmed'
    },
    {
        id: 3,
        doctorEmail: 'doctor@test.com',
        patientName: 'María González',
        patientPhone: '+56 9 5555 1234',
        date: '2025-07-08', // Martes
        time: '11:00',
        duration: 30,
        type: 'Consulta Especializada',
        status: 'confirmed'
    },
    {
        id: 4,
        doctorEmail: 'doctor@test.com',
        patientName: 'Pedro Sánchez',
        patientPhone: '+56 9 9999 8888',
        date: '2025-07-09', // Miércoles
        time: '14:30',
        duration: 30,
        type: 'Consulta General',
        status: 'pending'
    },
    {
        id: 5,
        doctorEmail: 'doctor@test.com',
        patientName: 'Laura Fernández',
        patientPhone: '+56 9 7777 6666',
        date: '2025-07-10', // Jueves
        time: '09:30',
        duration: 60,
        type: 'Examen Médico',
        status: 'confirmed'
    },
    {
        id: 6,
        doctorEmail: 'doctor@test.com',
        patientName: 'Roberto Silva',
        patientPhone: '+56 9 3333 2222',
        date: '2025-07-11', // Viernes
        time: '16:00',
        duration: 30,
        type: 'Control',
        status: 'confirmed'
    }
];

/**
 * Endpoint protegido para obtener las citas del médico autenticado
 * @route GET /api/appointments
 * @access Private (Doctor role required)
 * @returns {Object} Lista de citas filtradas por email del doctor
 */
const { verifyToken } = require('./middlewares/authMiddleware');
app.get('/api/appointments', verifyToken, (req, res) => {
    try {
        const userEmail = req.user.email;
        
        // Filtrar citas por doctor autenticado
        const doctorAppointments = sampleAppointments.filter(
            appointment => appointment.doctorEmail === userEmail
        );
        
        res.json({
            success: true,
            data: doctorAppointments,
            message: 'Reservas obtenidas correctamente'
        });
    } catch (error) {
        console.error('Error obteniendo reservas:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

/**
 * Health check endpoint para monitoreo del servidor
 * @route GET /api/health
 * @access Public
 */
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

/**
 * Endpoint para obtener usuarios de prueba del sistema
 * @route GET /api/test-users  
 * @access Public
 * @description Devuelve lista de credenciales para testing y demostración
 */
app.get('/api/test-users', (req, res) => {
    res.json({
        success: true,
        message: 'Usuarios de prueba disponibles',
        users: [
            {
                email: 'doctor@test.com',
                password: '123456',
                role: 'doctor',
                name: 'Dr. Juan Pérez'
            },
            {
                email: 'paciente@test.com',
                password: '123456',
                role: 'patient',
                name: 'María González'
            },
            {
                email: 'admin@test.com',
                password: '123456',
                role: 'admin',
                name: 'Admin Sistema'
            }
        ]
    });
});

// Manejo global de errores y rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

/**
 * Inicialización del servidor con configuración de desarrollo
 * TODO: Habilitar conexión a BD para producción
 */
const startServer = async () => {
    try {
        console.log('🚀 Iniciando servidor en modo desarrollo...');
        
        // Base de datos deshabilitada temporalmente para prototipo
        // TODO: Descomentar para producción con BD real
        // console.log('🔌 Probando conexión a la base de datos...');
        // const isConnected = await testConnection();
        // if (isConnected) {
        //     console.log('🔧 Inicializando base de datos...');
        //     await initializeDatabase();
        // }
        
        app.listen(PORT, () => {
            console.log('\n🚀 ===== SERVIDOR INICIADO =====');
            console.log(`📍 Puerto: http://localhost:${PORT}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
            console.log(`💚 Salud: http://localhost:${PORT}/api/health`);
            console.log(`👥 Usuarios prueba: http://localhost:${PORT}/api/test-users`);
            console.log('⚠️  Base de datos desactivada temporalmente');
            console.log('===============================\n');
        });
        
    } catch (error) {
        console.error('❌ Error iniciando servidor:', error);
        process.exit(1);
    }
};

// Manejo limpio del cierre del servidor
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

startServer();
