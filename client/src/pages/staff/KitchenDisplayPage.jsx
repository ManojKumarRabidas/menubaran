import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute.jsx';
import { OrderTicket } from '../../components/kitchen/OrderTicket.jsx';
import { KitchenAlert } from '../../components/kitchen/KitchenAlert.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { UserProfilePanel } from '../../components/common/UserProfilePanel.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { getTodaysOrdersByRestaurant, updateOrderStatus } from '../../services/api.js';

const FILTER_OPTIONS = ['all', 'pending', 'cooking', 'ready'];

const FILTER_STYLES = {
  all: 'bg-indigo-600 text-white shadow-md',
  pending: 'bg-amber-500 text-white shadow-md',
  cooking: 'bg-blue-500 text-white shadow-md',
  ready: 'bg-emerald-500 text-white shadow-md',
};

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
        const response = await getTodaysOrdersByRestaurant(user?.restaurantId);
        setOrders(response.data || []);
      } catch (err) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user?.restaurantId]);

  useEffect(() => {
    const handleNewOrder = (data) => {
      if (data.restaurantId !== user?.restaurantId) return;
      setOrders(prev => [data.order, ...prev]);
      setAlertOrder(data.order);
      setShowAlert(true);
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
      } catch (e) { }
    };
    socket?.on('order:new', handleNewOrder);
    return () => socket?.off('order:new', handleNewOrder);
  }, [user?.restaurantId, socket]);

  useEffect(() => {
    const handleStatusUpdate = (data) => {
      if (data.restaurantId !== user?.restaurantId) return;
      setOrders(prev =>
        prev.map(o => o._id === data.orderId ? { 
          ...o, 
          status: data.newStatus,
          statusHistory: [...(o.statusHistory || []), { status: data.newStatus, timestamp: new Date().toISOString() }]
        } : o)
      );
    };
    socket?.on('order:statusUpdate', handleStatusUpdate);
    return () => socket?.off('order:statusUpdate', handleStatusUpdate);
  }, [user?.restaurantId, socket]);

  const handleStartCooking = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'cooking');
      setOrders(prev => prev.map(o => o._id === orderId ? { 
        ...o, 
        status: 'cooking',
        statusHistory: [...(o.statusHistory || []), { status: 'cooking', timestamp: new Date().toISOString() }]
      } : o));
      socket?.emit('order:statusUpdate', { orderId, newStatus: 'cooking', restaurantId: user?.restaurantId });
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await updateOrderStatus(orderId, 'ready');
      setOrders(prev => prev.map(o => o._id === orderId ? { 
        ...o, 
        status: 'ready',
        statusHistory: [...(o.statusHistory || []), { status: 'ready', timestamp: new Date().toISOString() }]
      } : o));
      socket?.emit('order:statusUpdate', { orderId, newStatus: 'ready', restaurantId: user?.restaurantId });
    } catch (err) {
      console.error('Failed to update order');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['cook']}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
          <LoadingSpinner size="lg" className="text-indigo-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['cook']}>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">🔥 Kitchen Display System</h1>
            <p className="text-xs text-gray-500">Manage orders and track meal prep</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Live
            </span>
            <button
              onClick={() => setShowProfile(true)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-extrabold text-sm hover:ring-2 hover:ring-orange-300 transition"
              title="My Profile"
            >
              {(user?.name || '?')[0]}
            </button>
            <button
              onClick={() => { logout(); navigate('/staff/login'); }}
              className="px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex gap-2">
          {FILTER_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-5 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${filter === option
                ? FILTER_STYLES[option]
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            >
              {option}
              <span className="ml-1.5 text-xs opacity-80">
                ({option === 'all' ? orders.length : orders.filter(o => o.status === option).length})
              </span>
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        <main className="p-6 max-w-7xl mx-auto">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrders.map(order => (
                <OrderTicket
                  key={order._id}
                  order={order}
                  onStartCooking={handleStartCooking}
                  onMarkReady={handleMarkReady}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-extrabold text-gray-700 mb-1">All caught up!</h2>
              <p className="text-gray-400 text-sm">
                No {filter !== 'all' ? filter : ''} orders at the moment.
              </p>
            </div>
          )}
        </main>

        <KitchenAlert
          tableNumber={alertOrder?.tableNumber}
          isVisible={showAlert}
          onDismiss={() => setShowAlert(false)}
        />
        <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </ProtectedRoute>
  );
}