/**
 * Servicio de API para comunicación con el backend
 * Centraliza todas las peticiones HTTP y manejo de autenticación JWT
 * @version 1.0.0
 */

const API_BASE_URL = 'http://localhost:4000/api';

// Interfaces TypeScript para tipado fuerte
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'patient' | 'admin';
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'doctor' | 'patient' | 'admin';
  phone?: string;
}

export interface Appointment {
  id: number;
  doctorEmail: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // en minutos
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

/**
 * Clase principal para manejo de peticiones HTTP
 * Implementa patrón Singleton para gestión centralizada de API
 */
class ApiService {
  /**
   * Configura headers HTTP con autenticación opcional
   * @param includeAuth - Si incluir token JWT en Authorization header
   */
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Maneja respuestas HTTP y errores de forma centralizada
   * @param response - Response object de fetch
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  }

  // === ENDPOINTS PÚBLICOS ===
  
  async healthCheck(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse<ApiResponse>(response);
  }

  async getTestUsers(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/test-users`);
    return this.handleResponse<ApiResponse>(response);
  }

  // === AUTENTICACIÓN ===
  
  /**
   * Autentica usuario y almacena token JWT
   * @param credentials - Email y contraseña del usuario
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    const data = await this.handleResponse<LoginResponse>(response);
    
    // Almacenar credenciales en localStorage si login exitoso
    if (data.success && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<ApiResponse>(response);
  }

  async verifyToken(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: this.getHeaders(true),
    });
    
    return this.handleResponse<ApiResponse<User>>(response);
  }

  /**
   * Cierra sesión del usuario y limpia almacenamiento local
   * Asegura limpieza incluso si el servidor falla
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });
      
      const data = await this.handleResponse<ApiResponse>(response);
      this.clearAuth();
      return data;
    } catch (error) {
      // Garantizar limpieza local incluso con errores de red
      this.clearAuth();
      throw error;
    }
  }

  // === UTILIDADES DE AUTENTICACIÓN ===
  
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // === ENDPOINTS PROTEGIDOS ===
  
  /**
   * Obtiene citas del médico autenticado
   * @requires Authentication JWT token
   */
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: this.getHeaders(true),
    });
    
    return this.handleResponse<ApiResponse<Appointment[]>>(response);
  }
}

// Instancia singleton del servicio de API
export const apiService = new ApiService();
export default apiService;
