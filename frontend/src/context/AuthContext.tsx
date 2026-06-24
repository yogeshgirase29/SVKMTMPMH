import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

interface AdminUser {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const data = await authApi.checkSession();
        if (data.success && data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.admin);
        } else {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        setIsAuthenticated(false);
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      if (data.success) {
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
        }
        setIsAuthenticated(true);
        setAdminUser(data.admin);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      setAdminUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setAdminUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
