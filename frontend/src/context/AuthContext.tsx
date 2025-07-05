import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../services/api';
import { apiService } from '../services/api';

// Tipos para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, []);

  // Función para verificar autenticación actual
  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Verificar si hay token en localStorage
      if (!apiService.isAuthenticated()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Verificar token con el backend
      const response = await apiService.verifyToken();
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Token inválido, limpiar localStorage
        apiService.clearAuth();
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      // En caso de error, limpiar autenticación
      apiService.clearAuth();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función de login
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await apiService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error) {
      setUser(null);
      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    
    const response = await apiService.register(userData);
    
    if (!response.success) {
      setIsLoading(false);
      throw new Error(response.message || 'Error en el registro');
    }
    
    // Después del registro exitoso, automáticamente hacer login
    await login({
      email: userData.email,
      password: userData.password
    });
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      await apiService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
      // Aún así continuar con el logout local
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Valor del contexto
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
