import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

/**
 * Hook to access authentication context
 * @returns {object} Auth context with user, token, login, logout
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Decodes a mock JWT token
 * @param {string} token - Base64-encoded JSON token
 * @returns {object} Decoded payload
 */
export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token));
  } catch (e) {
    return null;
  }
};

/**
 * Validates a token's expiration
 * @param {string} token - Base64-encoded JSON token
 * @returns {boolean} True if token is still valid
 */
export const isTokenValid = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return false;
  return payload.exp > Date.now();
};

export default useAuth;
