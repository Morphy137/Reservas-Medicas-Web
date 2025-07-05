import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../services/api';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [showTestUsers, setShowTestUsers] = useState(false);

  // Usuarios de prueba para facilitar testing
  const testUsers = [
    { email: 'doctor@test.com', password: '123456', role: 'Doctor', icon: 'bi-person-badge', color: 'from-blue-500 to-blue-600' },
    { email: 'paciente@test.com', password: '123456', role: 'Paciente', icon: 'bi-person-heart', color: 'from-green-500 to-green-600' },
    { email: 'admin@test.com', password: '123456', role: 'Administrador', icon: 'bi-gear-fill', color: 'from-purple-500 to-purple-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Email y contraseña son requeridos');
      return;
    }

    try {
      await login(formData);
      // Siempre redirigir a la página de inicio después del login exitoso
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  const handleTestUserLogin = (testUser: typeof testUsers[0]) => {
    setFormData({
      email: testUser.email,
      password: testUser.password
    });
    setError('');
  };

  return (
    <div className="login-page-container">
      {/* Hero Section con imagen de fondo similar a la página principal */}
      <div className="login-hero-section">
        <div className="login-content-wrapper">
          <div className="login-card">
            {/* Header del formulario */}
            <div className="login-header">
              <div className="login-logo">
                <i className="bi bi-heart-pulse login-logo-icon"></i>
              </div>
              <h1 className="login-title">Bienvenido</h1>
              <p className="login-subtitle">Sistema de Reservas Médicas</p>
            </div>
            
            {/* Formulario de login */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-2"></i>
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-2"></i>
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="error-message">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? (
                  <div className="loading-content">
                    <div className="spinner"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="login-divider">
              <span>o</span>
            </div>

            {/* Usuarios de prueba */}
            <div className="test-users-section">
              <button
                type="button"
                onClick={() => setShowTestUsers(!showTestUsers)}
                className="test-users-toggle"
              >
                <i className="bi bi-people me-2"></i>
                {showTestUsers ? 'Ocultar' : 'Mostrar'} usuarios de prueba
                <i className={`bi bi-chevron-${showTestUsers ? 'up' : 'down'} ms-2`}></i>
              </button>

              {showTestUsers && (
                <div className="test-users-grid">
                  <p className="test-users-description">
                    Haz clic en cualquier usuario para acceso rápido:
                  </p>
                  {testUsers.map((user, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTestUserLogin(user)}
                      className="test-user-card"
                      disabled={isLoading}
                    >
                      <div className={`test-user-icon bg-gradient-to-r ${user.color}`}>
                        <i className={`bi ${user.icon}`}></i>
                      </div>
                      <div className="test-user-info">
                        <div className="test-user-role">{user.role}</div>
                        <div className="test-user-email">{user.email}</div>
                      </div>
                      <i className="bi bi-arrow-right test-user-arrow"></i>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
