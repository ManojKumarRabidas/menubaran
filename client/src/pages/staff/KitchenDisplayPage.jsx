import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute.jsx';
import { OrderTicket } from '../../components/kitchen/OrderTicket.jsx';
import { KitchenAlert } from '../../components/kitchen/KitchenAlert.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { UserProfilePanel } from '../../components/common/UserProfilePanel.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { getOrdersByRestaurant, updateOrderStatus } from '../../services/api.js';

const FILTER_OPTIONS = ['all', 'pending', 'cooking', 'ready'];

export default function KitchenDisplayPage() {
  const { user, logout } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [alertOrder, setAlertOrder] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrdersByRestaurant(user?.restaurantId);
        setOrders(response.data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.restaurantId]);

  // Listen for new orders
  useEffect(() => {
    const handleNewOrder = (data) => {
      if (data.restaurantId === user?.restaurantId) {
        // Add new order to the top
        setOrders(prev => [data.order, ...prev]);
        setAlertOrder(data.order);
        setShowAlert(true);

        // Play ding sound using Web Audio API
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.3);
        } catch (e) {
          console.log('Audio not supported');
        }
      }
    };

    socket?.on('order:new', handleNewOrder);
    return () => {
      socket?.off('order:new', handleNewOrder);
    };
  }, [user?.restaurantId, socket]);

  // Listen for order status updates
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      if (data.restaurantId === user?.restaurantId) {
        setOrders(prev =>
          prev.map(order =>
            order.id === data.orderId
              ? { ...order, status: data.newStatus }
              : order
          )
        );
      }
    };

    socket?.on('order:statusUpdate', handleStatusUpdate);
    return () => {
      socket?.off('order:statusUpdate', handleStatusUpdate);
    };
  }, [user?.restaurantId, socket]);

  const handleStartCooking = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'cooking');
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'cooking' } : order
        )
      );
      socket?.emit('order:statusUpdate', {
        orderId,
        newStatus: 'cooking',
        restaurantId: user?.restaurantId
      });
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'ready');
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'ready' } : order
        )
      );
      socket?.emit('order:statusUpdate', {
        orderId,
        newStatus: 'ready',
        restaurantId: user?.restaurantId
      });
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['cook']}>
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <LoadingSpinner size="lg" className="text-green-400" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['cook']}>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">🔥 Kitchen Display System</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage orders and track meal prep</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
              Live
            </span>
            {/* Profile Button */}
            <button
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-extrabold text-lg hover:ring-2 hover:ring-orange-300 transition"
              title="My Profile"
            >
              {(user?.name || '?')[0]}
            </button>
            {/* Quick Logout */}
            <button
              onClick={() => { logout(); navigate('/staff/login'); }}
              className="px-3 py-2 bg-gray-700 text-red-400 rounded-xl text-sm font-bold hover:bg-red-900/40 hover:text-red-300 transition"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex gap-3">
          {FILTER_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-6 py-2 rounded-full font-semibold capitalize transition-all ${
                filter === option
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option}
              {option === 'all' && (
                <span className="ml-2 text-sm">({orders.length})</span>
              )}
              {option !== 'all' && (
                <span className="ml-2 text-sm">({orders.filter(o => o.status === option).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <main className="p-6 max-w-7xl mx-auto">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map(order => (
                <OrderTicket
                  key={order.id}
                  order={order}
                  onStartCooking={handleStartCooking}
                  onMarkReady={handleMarkReady}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-300 mb-2">All caught up!</h2>
              <p className="text-gray-500">No {filter !== 'all' ? filter : ''} orders at the moment.</p>
            </div>
          )}
        </main>

        {/* Alert */}
        <KitchenAlert
          tableNumber={alertOrder?.tableNumber}
          isVisible={showAlert}
          onDismiss={() => setShowAlert(false)}
        />

        {/* User Profile Drawer */}
        <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </ProtectedRoute>
  );
}
