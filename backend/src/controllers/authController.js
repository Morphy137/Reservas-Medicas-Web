const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// Usuarios estáticos para pruebas (sin base de datos)
const STATIC_USERS = [
    {
        id: 1,
        email: 'doctor@test.com',
        password: '$2b$10$qb3kQ1xX6ses/urqcLtWouUb3.KyT9WCMXgK3cHCbUu/tHXjzWaei', // 123456
        role: 'doctor',
        name: 'Dr. Juan Pérez',
        phone: '+56912345678'
    },
    {
        id: 2,
        email: 'paciente@test.com',
        password: '$2b$10$qb3kQ1xX6ses/urqcLtWouUb3.KyT9WCMXgK3cHCbUu/tHXjzWaei', // 123456
        role: 'patient',
        name: 'María González',
        phone: '+56987654321'
    },
    {
        id: 3,
        email: 'admin@test.com',
        password: '$2b$10$qb3kQ1xX6ses/urqcLtWouUb3.KyT9WCMXgK3cHCbUu/tHXjzWaei', // 123456
        role: 'admin',
        name: 'Admin Sistema',
        phone: '+56911111111'
    }
];

class AuthController {
    // Login de usuario
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validación básica
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario en datos estáticos
            const user = STATIC_USERS.find(u => u.email === email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar JWT
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Respuesta exitosa (sin datos sensibles)
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                success: true,
                message: 'Login exitoso',
                token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Registro de usuario (para prototipo)
    static async register(req, res) {
        try {
            const { email, password, name, role } = req.body;

            // Validación básica
            if (!email || !password || !name || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            // Verificar si el usuario ya existe en datos estáticos
            const existingUser = STATIC_USERS.find(u => u.email === email);
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
            }

            // Simular creación de usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUserId = STATIC_USERS.length + 1;

            const newUser = {
                id: newUserId,
                email,
                password: hashedPassword,
                name,
                role,
                phone: ''
            };

            // En un entorno real, esto se guardaría en la base de datos
            // Por ahora solo simularemos que se creó
            console.log('Usuario simulado creado:', { ...newUser, password: '[HIDDEN]' });

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente (simulado)',
                userId: newUserId
            });

        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Verificar token
    static async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = STATIC_USERS.find(u => u.id === decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            const { password: _, ...userWithoutPassword } = user;

            res.json({
                success: true,
                user: userWithoutPassword
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }

    // Logout (opcional para prototipo)
    static async logout(req, res) {
        res.json({
            success: true,
            message: 'Logout exitoso'
        });
    }
}

module.exports = AuthController;
