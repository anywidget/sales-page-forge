import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

export type PlanType = 'free' | 'monthly' | 'lifetime';

export interface User {
  id: string;
  email: string;
  plan: PlanType;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePlan: (plan: PlanType) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const userData = await response.json();
    if (!response.ok) {
      throw new Error(userData.error || 'Login failed');
    }
    setUser(userData);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const response = await apiRequest('POST', '/api/auth/register', { email, password });
    const userData = await response.json();
    if (!response.ok) {
      throw new Error(userData.error || 'Registration failed');
    }
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  }, []);

  const updatePlan = useCallback(async (plan: PlanType) => {
    const response = await apiRequest('POST', '/api/auth/upgrade', { plan });
    const userData = await response.json();
    if (!response.ok) {
      throw new Error(userData.error || 'Upgrade failed');
    }
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updatePlan,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
