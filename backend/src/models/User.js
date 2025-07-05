const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error buscando usuario por email:', error);
            throw error;
        }
    }

    // Buscar usuario por ID
    static async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error buscando usuario por ID:', error);
            throw error;
        }
    }

    // Crear nuevo usuario
    static async create(userData) {
        try {
            const { email, password, name, role } = userData;
            
            // Hash de la contraseña
            const hashedPassword = bcrypt.hashSync(password, 10);
            
            const [result] = await pool.execute(
                'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, name, role]
            );
            
            return result.insertId;
        } catch (error) {
            console.error('Error creando usuario:', error);
            throw error;
        }
    }

    // Verificar contraseña
    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    // Obtener información completa del usuario (con datos de doctor/paciente)
    static async getFullUserData(userId) {
        try {
            const user = await this.findById(userId);
            if (!user) return null;

            let additionalData = null;

            if (user.role === 'doctor') {
                const [doctorRows] = await pool.execute(
                    'SELECT * FROM doctors WHERE user_id = ?',
                    [userId]
                );
                additionalData = doctorRows[0] || null;
            } else if (user.role === 'patient') {
                const [patientRows] = await pool.execute(
                    'SELECT * FROM patients WHERE user_id = ?',
                    [userId]
                );
                additionalData = patientRows[0] || null;
            }

            return {
                ...user,
                additionalData
            };
        } catch (error) {
            console.error('Error obteniendo datos completos del usuario:', error);
            throw error;
        }
    }

    // Listar todos los doctores
    static async getAllDoctors() {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    u.id as user_id,
                    u.name,
                    u.email,
                    d.id as doctor_id,
                    d.specialty,
                    d.license_number,
                    d.phone,
                    d.experience_years
                FROM users u
                INNER JOIN doctors d ON u.id = d.user_id
                WHERE u.role = 'doctor'
                ORDER BY u.name
            `);
            return rows;
        } catch (error) {
            console.error('Error obteniendo doctores:', error);
            throw error;
        }
    }

    // Listar todos los pacientes
    static async getAllPatients() {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    u.id as user_id,
                    u.name,
                    u.email,
                    p.id as patient_id,
                    p.phone,
                    p.birth_date,
                    p.medical_history
                FROM users u
                INNER JOIN patients p ON u.id = p.user_id
                WHERE u.role = 'patient'
                ORDER BY u.name
            `);
            return rows;
        } catch (error) {
            console.error('Error obteniendo pacientes:', error);
            throw error;
        }
    }
}

module.exports = User;
