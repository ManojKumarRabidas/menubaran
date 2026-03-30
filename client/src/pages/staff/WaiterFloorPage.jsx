import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute.jsx';
import { TableCard } from '../../components/waiter/TableCard.jsx';
import { NotificationPanel } from '../../components/waiter/NotificationPanel.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { UserProfilePanel } from '../../components/common/UserProfilePanel.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { getTablesByRestaurant, getTodaysOrdersByRestaurant } from '../../services/api.js';

export default function WaiterFloorPage() {
  const { user, logout } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('tables');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tablesRes = await getTablesByRestaurant(user?.restaurantId);
        const ordersRes = await getTodaysOrdersByRestaurant(user?.restaurantId);
        setTables(tablesRes.data || []);
        setOrders(ordersRes.data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.restaurantId]);

  // Listen for new orders
  useEffect(() => {
    const handleNewOrder = (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          type: 'order',
          message: `New order placed — Table ${data.order.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          onDismiss: () => dismissNotification(0)
        };
        setNotifications(prev => [notification, ...prev]);
      }
    };

    socket.on('order:new', handleNewOrder);
    return () => {
      socket.off('order:new', handleNewOrder);
    };
  }, [user?.restaurantId, socket]);

  // Listen for order status updates
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          type: data.newStatus === 'ready' ? 'ready' : 'order',
          message: data.newStatus === 'ready'
            ? `Order ready for pickup — Table ${data.tableNumber}`
            : `Order status updated — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          onDismiss: () => dismissNotification(0)
        };
        setNotifications(prev => [notification, ...prev]);
      }
    };

    socket.on('order:statusUpdate', handleStatusUpdate);
    return () => {
      socket.off('order:statusUpdate', handleStatusUpdate);
    };
  }, [user?.restaurantId, socket]);

  // Listen for bill requests
  useEffect(() => {
    const handleBillRequest = (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          type: 'bill',
          message: `Bill requested — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          onDismiss: () => dismissNotification(0)
        };
        setNotifications(prev => [notification, ...prev]);
      }
    };

    socket.on('table:requestBill', handleBillRequest);
    return () => {
      socket.off('table:requestBill', handleBillRequest);
    };
  }, [user?.restaurantId, socket]);

  // Listen for water requests
  useEffect(() => {
    const handleWaterRequest = (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          type: 'water',
          message: `Water requested — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          onDismiss: () => dismissNotification(0)
        };
        setNotifications(prev => [notification, ...prev]);
      }
    };

    socket.on('table:requestWater', handleWaterRequest);
    return () => {
      socket.off('table:requestWater', handleWaterRequest);
    };
  }, [user?.restaurantId, socket]);

  const dismissNotification = (idx) => {
    setNotifications(prev => prev.filter((_, i) => i !== idx));
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const getOrderForTable = (tableId) => {
    return orders.find(o => o.tableId === tableId);
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['waiter']}>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" className="text-blue-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['waiter']}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 py-4 shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🧑‍💼 Waiter Floor Management</h1>
            <p className="text-blue-100 text-sm mt-0.5">Manage tables and track orders in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-sm text-blue-200">
              <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse"></span>
              Live
            </span>
            {/* Notification badge */}
            {notifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
            {/* Profile Button */}
            <button
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white/50 flex items-center justify-center text-white font-extrabold text-lg hover:border-white transition"
              title="My Profile"
            >
              {(user?.name || '?')[0]}
            </button>
            {/* Quick Logout */}
            <button
              onClick={() => { logout(); navigate('/staff/login'); }}
              className="px-3 py-2 bg-blue-700/50 rounded-xl text-sm font-bold hover:bg-red-600/60 transition"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 flex gap-2 px-4 py-2">
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex-1 px-4 py-2 rounded font-semibold transition ${activeTab === 'tables'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
                }`}
            >
              Tables ({tables.length})
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 px-4 py-2 rounded font-semibold transition relative ${activeTab === 'notifications'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
                }`}
            >
              Notifications
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`${isMobile ? '' : 'flex gap-6'}`}>
          {/* Tables Section */}
          {(!isMobile || activeTab === 'tables') && (
            <div className={`${isMobile ? '' : 'flex-1'} p-6`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Floor</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tables.map(table => (
                  <TableCard
                    key={table._id}
                    table={table}
                    order={getOrderForTable(table._id)}
                    onTableClick={handleTableClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {(!isMobile || activeTab === 'notifications') && (
            <div className={`${isMobile ? '' : 'w-96'} p-6 border-t md:border-t-0 md:border-l border-gray-200`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Alerts</h2>
              <NotificationPanel notifications={notifications} />
            </div>
          )}
        </div>

        {/* Order Modal */}
        {showOrderModal && selectedTable && (
          <div className="fixed inset-0 z-50 flex items-center md:items-start md:pt-16 bg-black bg-opacity-50">
            <div className="bg-white rounded-t-lg md:rounded-lg w-full md:w-96 shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-4 flex items-center justify-between">
                <h2 className="font-bold text-lg">Table {selectedTable.number}</h2>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-2xl font-bold hover:opacity-80"
                >
                  ×
                </button>
              </div>

              <div className="p-6">
                {getOrderForTable(selectedTable._id) ? (
                  <div>
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-blue-900">
                        Status: <span className="capitalize">{getOrderForTable(selectedTable._id)?.status}</span>
                      </p>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-3">Items:</h3>
                    <div className="space-y-2 mb-6">
                      {getOrderForTable(selectedTable._id)?.items.map((item, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded">
                          <p className="font-semibold text-gray-900">×{item.qty} {item.name}</p>
                          {item.note && <p className="text-xs text-gray-600 italic">{item.note}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-lg font-bold text-orange-600">
                        Total: ₹{getOrderForTable(selectedTable._id)?.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No active order for this table</p>
                )}

                <button
                  onClick={() => setShowOrderModal(false)}
                  className="mt-6 w-full bg-gray-200 text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* User Profile Drawer */}
        <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
      </div>
    </ProtectedRoute>
  );
}
