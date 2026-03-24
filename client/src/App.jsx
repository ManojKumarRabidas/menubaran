import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';

// Customer Pages
import MenuPage from './pages/customer/MenuPage.jsx';
import CartPage from './pages/customer/CartPage.jsx';
import OrderTrackingPage from './pages/customer/OrderTrackingPage.jsx';

// Staff Pages
import LoginPage from './pages/staff/LoginPage.jsx';
import KitchenDisplayPage from './pages/staff/KitchenDisplayPage.jsx';
import WaiterFloorPage from './pages/staff/WaiterFloorPage.jsx';
import OwnerDashboardPage from './pages/staff/OwnerDashboardPage.jsx';

// Common Pages
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Routes>
              {/* Customer Routes - No Auth Required */}
              <Route path="/menu/:restaurantSlug/table/:tableId" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order/:orderId" element={<OrderTrackingPage />} />

              {/* Staff Routes - Auth Required */}
              <Route path="/staff/login" element={<LoginPage />} />
              <Route path="/kitchen" element={<KitchenDisplayPage />} />
              <Route path="/floor" element={<WaiterFloorPage />} />
              <Route path="/dashboard" element={<OwnerDashboardPage />} />

              {/* Home Redirect */}
              <Route path="/" element={<Navigate to="/menu/spice-garden/table/table_1" replace />} />

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
