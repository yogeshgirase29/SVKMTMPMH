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
      let token = sessionStorage.getItem('adminToken');
      
      // If no token in sessionStorage, check other open tabs via BroadcastChannel
      if (!token) {
        try {
          const channel = new BroadcastChannel('admin_auth_channel');
          
          const sessionPromise = new Promise<{ token: string; user: any } | null>((resolve) => {
            const timeout = setTimeout(() => {
              resolve(null);
            }, 150); // wait up to 150ms for other tabs to respond

            channel.onmessage = (event) => {
              if (event.data && event.data.type === 'SESSION_RESPONSE') {
                clearTimeout(timeout);
                resolve({ token: event.data.token, user: event.data.user });
              }
            };
          });

          channel.postMessage({ type: 'REQUEST_SESSION' });
          const response = await sessionPromise;
          channel.close();

          if (response) {
            token = response.token;
            sessionStorage.setItem('adminToken', token);
            setIsAuthenticated(true);
            setAdminUser(response.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to sync session across tabs:', e);
        }
      }

      if (!token) {
        setIsAuthenticated(false);
        setAdminUser(null);
        setLoading(false);
        return;
      }
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

  // Listen to cross-tab communication (Request session and Logout syncing)
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('admin_auth_channel');
      
      channel.onmessage = (event) => {
        if (event.data) {
          if (event.data.type === 'REQUEST_SESSION') {
            const token = sessionStorage.getItem('adminToken');
            if (token && isAuthenticated && adminUser) {
              channel.postMessage({
                type: 'SESSION_RESPONSE',
                token,
                user: adminUser
              });
            }
          } else if (event.data.type === 'LOGOUT') {
            sessionStorage.removeItem('adminToken');
            localStorage.setItem('adminActiveTab', 'overview');
            setIsAuthenticated(false);
            setAdminUser(null);
          }
        }
      };

      return () => {
        channel.close();
      };
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated, adminUser]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      if (data.success) {
        if (data.token) {
          sessionStorage.setItem('adminToken', data.token);
        }
        localStorage.setItem('adminActiveTab', 'overview'); // Reset tab to overview on login
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
      // Broadcast logout to other tabs
      try {
        const channel = new BroadcastChannel('admin_auth_channel');
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();
      } catch (e) {
        console.error(e);
      }
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      sessionStorage.removeItem('adminToken');
      localStorage.setItem('adminActiveTab', 'overview'); // Reset tab to overview on logout
      setIsAuthenticated(false);
      setAdminUser(null);
      setLoading(false);
    }
  };

  // Inactivity tracking (30 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: number;

    const resetTimer = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        sessionStorage.setItem('inactiveLogout', 'true');
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Initialize timer
    resetTimer();

    // Event listeners to detect activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'click', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Clean up
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

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
