const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection, initializeDatabase } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'], // Frontend React/Vite
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging básico
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas principales
app.use('/api/auth', authRoutes);

// Datos de ejemplo para reservas (simulando base de datos)
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

// Endpoint para obtener reservas del doctor autenticado
const { verifyToken } = require('./middlewares/authMiddleware');
app.get('/api/appointments', verifyToken, (req, res) => {
    try {
        const userEmail = req.user.email;
        
        // Filtrar reservas por doctor
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

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta para obtener información de usuarios de prueba
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

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
    console.error('Error global:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Función para iniciar el servidor
const startServer = async () => {
    try {
        console.log('🚀 Iniciando servidor en modo desarrollo...');
        
        // Comentar temporalmente la conexión a BD para testing
        // console.log('🔌 Probando conexión a la base de datos...');
        // const isConnected = await testConnection();
        
        // if (isConnected) {
        //     // Inicializar base de datos y tablas
        //     console.log('🔧 Inicializando base de datos...');
        //     await initializeDatabase();
        // }
        
        // Iniciar servidor sin BD por ahora
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

// Manejo de cierre del servidor
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Cerrando servidor...');
    process.exit(0);
});

// Iniciar servidor
startServer();
