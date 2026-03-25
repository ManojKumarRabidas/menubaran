import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';

// Public
import LandingPage from './pages/LandingPage.jsx';

// Customer Pages
import MenuPage from './pages/customer/MenuPage.jsx';
import CartPage from './pages/customer/CartPage.jsx';
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx';

// Owner / Staff Tools
import QRPrintPage from './pages/owner/QRPrintPage.jsx';

// Staff Pages
import LoginPage from './pages/staff/LoginPage.jsx';
import KitchenDisplayPage from './pages/staff/KitchenDisplayPage.jsx';
import WaiterFloorPage from './pages/staff/WaiterFloorPage.jsx';
import OwnerDashboardPage from './pages/staff/OwnerDashboardPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx'; // hypothetical admin dashboard page

// Common Pages
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Routes>
              {/* Landing / Home */}
              <Route path="/" element={<LandingPage />} />

              {/* Customer Routes – URL uses real DB IDs
                  e.g. /menu/rest_1/table/table_3 */}
              <Route path="/menu/:restaurantId/table/:tableId" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:orderId" element={<OrderTrackingPage />} />

              {/* Staff Routes */}
              <Route path="/staff/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<LoginPage isAdmin={true} />} />
              <Route path="/kitchen" element={<KitchenDisplayPage />} />
              <Route path="/floor" element={<WaiterFloorPage />} />
              <Route path="/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />

              {/* Printable QR Code Page – /qr/:restaurantId/:tableId */}
              <Route path="/qr/:restaurantId/:tableId" element={<QRPrintPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
