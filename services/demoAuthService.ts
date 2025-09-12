// Demo Authentication Service
// This service handles authentication using demo users without API connection

import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoUsers, DemoUser } from '../data/demoData';

const DEMO_USER_KEY = '@demo_user';
const DEMO_TOKEN_KEY = '@demo_token';

export interface AuthResponse {
  success: boolean;
  user?: DemoUser;
  token?: string;
  message?: string;
}

export class DemoAuthService {
  // Generate a simple demo token
  private generateDemoToken(userId: string): string {
    const timestamp = Date.now();
    return `demo_token_${userId}_${timestamp}`;
  }

  // Login with demo credentials
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in demo data
      const user = demoUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password
      );

      if (!user) {
        return {
          success: false,
          message: 'Credenciales inválidas. Usuarios demo disponibles:\n' +
                   'admin@florafauna.com / admin123\n' +
                   'researcher@florafauna.com / research123\n' +
                   'volunteer@florafauna.com / volunteer123\n' +
                   'demo@florafauna.com / demo123'
        };
      }

      // Generate demo token
      const token = this.generateDemoToken(user.id);

      // Store user and token
      await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
      await AsyncStorage.setItem(DEMO_TOKEN_KEY, token);

      return {
        success: true,
        user,
        token,
        message: `Bienvenido, ${user.name}!`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error durante el login demo'
      };
    }
  }

  // Register new demo user (simulated)
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if email already exists
      const existingUser = demoUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        return {
          success: false,
          message: 'El email ya está registrado. Usa uno de los usuarios demo existentes.'
        };
      }

      // Create new demo user
      const newUser: DemoUser = {
        id: `demo_${Date.now()}`,
        email,
        password,
        name,
        role: 'volunteer'
      };

      // Add to demo users (in memory only)
      demoUsers.push(newUser);

      // Generate demo token
      const token = this.generateDemoToken(newUser.id);

      // Store user and token
      await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(newUser));
      await AsyncStorage.setItem(DEMO_TOKEN_KEY, token);

      return {
        success: true,
        user: newUser,
        token,
        message: `Cuenta demo creada para ${name}!`
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error durante el registro demo'
      };
    }
  }

  // Get current demo user
  async getCurrentUser(): Promise<DemoUser | null> {
    try {
      const userJson = await AsyncStorage.getItem(DEMO_USER_KEY);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Get current demo token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(DEMO_TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      const token = await this.getToken();
      return !!(user && token);
    } catch (error) {
      return false;
    }
  }

  // Logout demo user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DEMO_USER_KEY);
      await AsyncStorage.removeItem(DEMO_TOKEN_KEY);
    } catch (error) {
      console.error('Error during demo logout:', error);
    }
  }

  // Update user profile (demo)
  async updateProfile(updates: Partial<DemoUser>): Promise<AuthResponse> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      const updatedUser = { ...currentUser, ...updates };
      await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser,
        message: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar perfil'
      };
    }
  }

  // Change password (demo)
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        return {
          success: false,
          message: 'Usuario no encontrado'
        };
      }

      if (user.password !== currentPassword) {
        return {
          success: false,
          message: 'Contraseña actual incorrecta'
        };
      }

      const updatedUser = { ...user, password: newPassword };
      await AsyncStorage.setItem(DEMO_USER_KEY, JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al cambiar contraseña'
      };
    }
  }

  // Get all demo users (for admin)
  getDemoUsers(): DemoUser[] {
    return demoUsers;
  }

  // Reset demo data
  async resetDemoData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DEMO_USER_KEY);
      await AsyncStorage.removeItem(DEMO_TOKEN_KEY);
      // Reset demo users array to original state
      demoUsers.splice(4); // Keep only the first 4 original users
    } catch (error) {
      console.error('Error resetting demo data:', error);
    }
  }
}

// Export singleton instance
export const demoAuthService = new DemoAuthService();