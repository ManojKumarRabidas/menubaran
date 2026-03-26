import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { staffLogin, adminLogin } from '../../services/api.js';

export default function LoginPage({ isAdmin = false }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // const response = await staffLogin(email, password);
      const response = isAdmin
        ? await adminLogin(email, password)        // your admin API
        : await staffLogin(email, password);
      const success = login(response.data.token);

      if (success) {
        // Redirect based on role
        const route = isAdmin
          ? '/admin-dashboard'
          : ({ cook: '/kitchen', waiter: '/floor', owner: '/dashboard' }[response.data.staff.role] || '/');
        navigate(route);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍽️</div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? 'Admin Login' : 'Staff Login'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin ? 'Admin Portal' : 'Restaurant Management System'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-semibold">⚠️ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cook@spice-garden.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : '→'}
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <span onClick={() => navigate('/')} className="py-5 text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "0", cursor: "pointer" }}>
              ← Back to Home
            </span>
          </form>

          {/* Demo Credentials */}
          {!isAdmin && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-semibold mb-3">DEMO CREDENTIALS</p>
              <div className="space-y-2 text-xs text-gray-600">
                <p>👨‍🍳 Cook: <code className="bg-gray-100 px-2 py-1 rounded">cook@spice-garden.com</code></p>
                <p>🧑‍💼 Waiter: <code className="bg-gray-100 px-2 py-1 rounded">waiter@spice-garden.com</code></p>
                <p>👔 Owner: <code className="bg-gray-100 px-2 py-1 rounded">owner@spice-garden.com</code></p>
                <p>Password for all: <code className="bg-gray-100 px-2 py-1 rounded">password123</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
