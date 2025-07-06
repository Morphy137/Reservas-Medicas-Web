-- ================================================================
-- SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
-- Sistema de Reservas Médicas - MediReservas
-- ================================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS reservas_medicas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE reservas_medicas;

-- ================================================================
-- TABLA DE USUARIOS
-- ================================================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    especialidad VARCHAR(100), -- Solo para doctores
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================================================================
-- TABLA DE CITAS/RESERVAS
-- ================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    motivo TEXT,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ================================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_fecha ON appointments(fecha_hora);
CREATE INDEX idx_appointments_estado ON appointments(estado);

-- ================================================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ================================================================

-- Usuario administrador por defecto
INSERT IGNORE INTO users (nombre, email, password, role) VALUES 
('Administrador', 'admin@medireservas.com', '$2b$10$8XqwlxZoFKJNzGy5Xo1ZbeP.Ep4oL4jnGhKo4PQXwZrGtYiZqDcOK', 'admin');

-- Doctores de ejemplo
INSERT IGNORE INTO users (nombre, email, password, role, especialidad, telefono) VALUES 
('Dr. Juan Pérez', 'juan.perez@medireservas.com', '$2b$10$8XqwlxZoFKJNzGy5Xo1ZbeP.Ep4oL4jnGhKo4PQXwZrGtYiZqDcOK', 'doctor', 'Cardiología', '+56912345678'),
('Dra. María González', 'maria.gonzalez@medireservas.com', '$2b$10$8XqwlxZoFKJNzGy5Xo1ZbeP.Ep4oL4jnGhKo4PQXwZrGtYiZqDcOK', 'doctor', 'Neurología', '+56987654321'),
('Dr. Carlos Silva', 'carlos.silva@medireservas.com', '$2b$10$8XqwlxZoFKJNzGy5Xo1ZbeP.Ep4oL4jnGhKo4PQXwZrGtYiZqDcOK', 'doctor', 'Pediatría', '+56911223344');

-- Pacientes de ejemplo
INSERT IGNORE INTO users (nombre, email, password, role, telefono, fecha_nacimiento) VALUES 
('Ana Torres', 'ana.torres@email.com', '$2b$10$8XqwlxZoFKJNzGy5Xo1ZbeP.Ep4oL4jnGhKo4PQXwZrGtYiZqDcOK', 'patient', '+56955667788', '1990-05-15'),
('Pedro Morales', 'pedro.morales@email.com', '$2b$10$8XqwlxZoFKJNzGy5Xo1ZbeP.Ep4oL4jnGhKo4PQXwZrGtYiZqDcOK', 'patient', '+56944556677', '1985-08-22');

-- ================================================================
-- VERIFICACIÓN DE INSTALACIÓN
-- ================================================================
SELECT 'Base de datos inicializada correctamente' as Status;
SELECT COUNT(*) as 'Usuarios creados' FROM users;
SELECT COUNT(*) as 'Doctores disponibles' FROM users WHERE role = 'doctor';
