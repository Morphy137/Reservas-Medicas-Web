const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'reservas_medicas',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear pool de conexiones para mejor rendimiento
const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        return false;
    }
};

// Función para inicializar la base de datos
const initializeDatabase = async () => {
    try {
        // Crear la base de datos si no existe
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port
        });

        await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`📊 Base de datos '${dbConfig.database}' verificada/creada`);
        
        await tempConnection.end();

        // Ahora crear las tablas
        await createTables();
        
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error.message);
    }
};

// Función para crear las tablas necesarias
const createTables = async () => {
    try {
        // Tabla de usuarios
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(100) NOT NULL,
                role ENUM('patient', 'doctor', 'admin') NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Tabla de doctores
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS doctors (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                specialty VARCHAR(100) NOT NULL,
                license_number VARCHAR(50) UNIQUE NOT NULL,
                phone VARCHAR(20),
                experience_years INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Tabla de pacientes
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS patients (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT NOT NULL,
                phone VARCHAR(20),
                birth_date DATE,
                medical_history TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // Tabla de citas/reservas
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                notes TEXT,
                diagnosis TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            )
        `);

        console.log('📋 Todas las tablas han sido creadas/verificadas correctamente');
        
        // Insertar datos de prueba si no existen
        await insertSampleData();
        
    } catch (error) {
        console.error('❌ Error creando tablas:', error.message);
    }
};

// Función para insertar datos de prueba
const insertSampleData = async () => {
    try {
        // Verificar si ya hay usuarios
        const [existingUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
        
        if (existingUsers[0].count === 0) {
            const bcrypt = require('bcryptjs');
            
            // Hash de la contraseña "123456" para todos los usuarios de prueba
            const hashedPassword = bcrypt.hashSync('123456', 10);
            
            // Insertar usuarios de prueba
            const [result1] = await pool.execute(`
                INSERT INTO users (email, password, name, role) VALUES 
                ('doctor@test.com', ?, 'Dr. Juan Pérez', 'doctor')
            `, [hashedPassword]);
            
            const [result2] = await pool.execute(`
                INSERT INTO users (email, password, name, role) VALUES 
                ('paciente@test.com', ?, 'María González', 'patient')
            `, [hashedPassword]);
            
            const [result3] = await pool.execute(`
                INSERT INTO users (email, password, name, role) VALUES 
                ('admin@test.com', ?, 'Admin Sistema', 'admin')
            `, [hashedPassword]);

            // Insertar doctor
            await pool.execute(`
                INSERT INTO doctors (user_id, specialty, license_number, phone, experience_years) VALUES 
                (?, 'Cardiología', 'LIC001', '+56912345678', 10)
            `, [result1.insertId]);

            // Insertar paciente
            await pool.execute(`
                INSERT INTO patients (user_id, phone, birth_date) VALUES 
                (?, '+56987654321', '1990-05-15')
            `, [result2.insertId]);

            console.log('👥 Usuarios de prueba creados:');
            console.log('   🩺 Doctor: doctor@test.com (pass: 123456)');
            console.log('   👤 Paciente: paciente@test.com (pass: 123456)');
            console.log('   🔧 Admin: admin@test.com (pass: 123456)');
        }
    } catch (error) {
        console.error('❌ Error insertando datos de prueba:', error.message);
    }
};

module.exports = {
    pool,
    testConnection,
    initializeDatabase
};
