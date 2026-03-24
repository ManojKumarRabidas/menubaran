import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Route wrapper that protects pages from unauthorized access
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Not Authorized</h1>
          <p className="text-gray-600 mb-8">You do not have permission to access this page.</p>
          <a
            href="/staff/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return children;
};
