import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class AuthService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para agregar el token a las peticiones
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar respuestas de error
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    try {
      const response = await this.api.post('/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Guardar token y datos del usuario
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de conexión',
      };
    }
  }

  async register(name: string, email: string, password: string, passwordConfirmation: string) {
    try {
      const response = await this.api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      const { token, user } = response.data;
      
      // Guardar token y datos del usuario
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de conexión',
      };
    }
  }

  async logout() {
    try {
      await this.api.post('/logout');
    } catch (error) {
      // Continuar con el logout local aunque falle la petición
    } finally {
      // Limpiar datos locales
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get('/me');
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error de conexión',
      };
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }

  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();