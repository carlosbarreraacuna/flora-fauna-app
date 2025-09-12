import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthService from '../services/authService';
import { demoAuthService, AuthResponse } from '../services/demoAuthService';
import { DemoUser } from '../data/demoData';

interface User {
  id: number | string;
  name: string;
  email: string;
  roles?: any[];
  role?: 'admin' | 'researcher' | 'volunteer';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  toggleDemoMode: () => void;
  getDemoUsers: () => DemoUser[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to demo mode

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Check demo authentication
        const authenticated = await demoAuthService.isAuthenticated();
        if (authenticated) {
          const demoUser = await demoAuthService.getCurrentUser();
          if (demoUser) {
            setUser({
              id: demoUser.id,
              name: demoUser.name,
              email: demoUser.email,
              role: demoUser.role
            });
            setIsAuthenticated(true);
          }
        }
      } else {
        // Check API authentication
        const authenticated = await AuthService.isAuthenticated();
        
        if (authenticated) {
          const storedUser = await AuthService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          } else {
            // Si no hay usuario almacenado, intentar obtenerlo del servidor
            await refreshUser();
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Demo login
        const result = await demoAuthService.login(email, password);
        
        if (result.success && result.user) {
          setUser({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
          });
          setIsAuthenticated(true);
          return { success: true, message: result.message };
        } else {
          return { success: false, error: result.message };
        }
      } else {
        // API login
        const result = await AuthService.login(email, password);
        
        if (result.success) {
          setUser(result.data.user);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Demo register
        if (password !== passwordConfirmation) {
          return { success: false, error: 'Las contraseñas no coinciden' };
        }
        
        const result = await demoAuthService.register(email, password, name);
        
        if (result.success && result.user) {
          setUser({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
          });
          setIsAuthenticated(true);
          return { success: true, message: result.message };
        } else {
          return { success: false, error: result.message };
        }
      } else {
        // API register
        const result = await AuthService.register(name, email, password, passwordConfirmation);
        
        if (result.success) {
          setUser(result.data.user);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, error: result.error };
        }
      }
    } catch (error) {
      return { success: false, error: 'Error inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        await demoAuthService.logout();
      } else {
        await AuthService.logout();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (isDemoMode) {
        const demoUser = await demoAuthService.getCurrentUser();
        if (demoUser) {
          setUser({
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            role: demoUser.role
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        const result = await AuthService.getCurrentUser();
        if (result.success) {
          setUser(result.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
    // Reset authentication state when switching modes
    setUser(null);
    setIsAuthenticated(false);
    // Re-check auth status in new mode
    setTimeout(() => checkAuthStatus(), 100);
  };

  const getDemoUsers = () => {
    return demoAuthService.getDemoUsers();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isDemoMode,
    login,
    register,
    logout,
    refreshUser,
    toggleDemoMode,
    getDemoUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};