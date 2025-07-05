// Servicio de API para comunicación con el backend
const API_BASE_URL = 'http://localhost:4000/api';

// Tipos de respuesta de la API
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

// Clase para manejar las peticiones a la API
class ApiService {
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

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición');
    }
    
    return data;
  }

  // Verificar salud del servidor
  async healthCheck(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse<ApiResponse>(response);
  }

  // Obtener usuarios de prueba
  async getTestUsers(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/test-users`);
    return this.handleResponse<ApiResponse>(response);
  }

  // Autenticación - Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    const data = await this.handleResponse<LoginResponse>(response);
    
    // Guardar token en localStorage si el login es exitoso
    if (data.success && data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  }

  // Autenticación - Registro
  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<ApiResponse>(response);
  }

  // Verificar token
  async verifyToken(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: this.getHeaders(true),
    });
    
    return this.handleResponse<ApiResponse<User>>(response);
  }

  // Logout
  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });
      
      const data = await this.handleResponse<ApiResponse>(response);
      
      // Limpiar localStorage independientemente de la respuesta
      this.clearAuth();
      
      return data;
    } catch (error) {
      // Aún así limpiar localStorage en caso de error
      this.clearAuth();
      throw error;
    }
  }

  // Limpiar datos de autenticación
  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Obtener usuario actual del localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar si hay un token válido
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Obtener token actual
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Obtener reservas del doctor autenticado
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: this.getHeaders(true),
    });
    
    return this.handleResponse<ApiResponse<Appointment[]>>(response);
  }
}

// Exportar instancia única del servicio
export const apiService = new ApiService();
export default apiService;
