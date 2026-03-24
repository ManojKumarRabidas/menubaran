import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        
        <div className="space-y-4">
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
            >
              Home
            </Link>
            <Link
              to="/staff/login"
              className="px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
