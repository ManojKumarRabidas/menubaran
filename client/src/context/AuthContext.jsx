import { createContext, useState, useEffect, useCallback } from 'react';
import { decodeToken, isTokenValid } from '../hooks/useAuth.js';

export const AuthContext = createContext();

const STORAGE_KEY = 'auth_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY);
    if (storedToken && isTokenValid(storedToken)) {
      const payload = decodeToken(storedToken);
      setToken(storedToken);
      setUser({
        id: payload.id,
        name: payload.name,
        role: payload.role,
        restaurantId: payload.restaurantId
      });
    } else if (storedToken) {
      // Token is expired, clear it
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken) => {
    const payload = decodeToken(newToken);
    if (payload) {
      setToken(newToken);
      setUser({
        id: payload.id,
        name: payload.name,
        role: payload.role,
        restaurantId: payload.restaurantId
      });
      localStorage.setItem(STORAGE_KEY, newToken);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
