import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute.jsx';
import { TableCard } from '../../components/waiter/TableCard.jsx';
import { NotificationPanel } from '../../components/waiter/NotificationPanel.jsx';
import { WaiterAlert } from '../../components/waiter/WaiterAlert.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { UserProfilePanel } from '../../components/common/UserProfilePanel.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import { getTablesByRestaurant, getTodaysOrdersByRestaurant, updateOrderStatus, getPendingRequestsByRestaurant, clearTableRequest } from '../../services/api.js';

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
  const [alertInfo, setAlertInfo] = useState(null);

  const playBeep = () => {
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
        const [tablesRes, ordersRes, requestsRes] = await Promise.all([
          getTablesByRestaurant(user?.restaurantId),
          getTodaysOrdersByRestaurant(user?.restaurantId),
          getPendingRequestsByRestaurant(user?.restaurantId),
        ]);
        setTables(tablesRes.data || []);
        setOrders(ordersRes.data || []);
        
        const initialNotifications = (requestsRes.data || []).map(req => ({
          id: req._id,
          type: req.type,
          tableId: req.tableId,
          tableNumber: req.tableNumber,
          message: `${req.type === 'bill' ? 'Bill' : req.type === 'water' ? 'Water' : 'Waiter'} requested — Table ${req.tableNumber}`,
          timestamp: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setNotifications(initialNotifications);
        
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
        setOrders(prev => [data.order, ...prev]);
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
        setOrders(prev =>
          prev.map(o => o._id === data.orderId ? { ...o, status: data.newStatus } : o)
        );
        const notification = {
          type: data.newStatus === 'ready' ? 'ready' : 'order',
          message: data.newStatus === 'ready'
            ? `Order ready for pickup — Table ${data.tableNumber}`
            : `Order status updated — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          onDismiss: () => dismissNotification(0)
        };
        setNotifications(prev => [notification, ...prev]);
        if (data.newStatus === 'ready') {
          playBeep();
          setAlertInfo({ tableNumber: data.tableNumber });
        }
      }
    };

    socket.on('order:statusUpdate', handleStatusUpdate);
    return () => {
      socket.off('order:statusUpdate', handleStatusUpdate);
    };
  }, [user?.restaurantId, socket]);

  // Listen for bill requests
  useEffect(() => {
    socket.on('table:requestBill', (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          id: data.requestId,
          type: 'bill',
          tableId: data.tableId,
          tableNumber: data.tableNumber,
          message: `Bill requested — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setNotifications(prev => [notification, ...prev]);
        playBeep();
      }
    });

    socket.on('table:requestWater', (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          id: data.requestId,
          type: 'water',
          tableId: data.tableId,
          tableNumber: data.tableNumber,
          message: `Water requested — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setNotifications(prev => [notification, ...prev]);
        playBeep();
      }
    });

    socket.on('table:requestWaiter', (data) => {
      if (data.restaurantId === user?.restaurantId) {
        const notification = {
          id: data.requestId,
          type: 'waiter',
          tableId: data.tableId,
          tableNumber: data.tableNumber,
          message: `Waiter requested — Table ${data.tableNumber}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setNotifications(prev => [notification, ...prev]);
        playBeep();
      }
    });

    socket.on('table:requestCleared', (data) => {
      if (data.restaurantId === user?.restaurantId) {
        setNotifications(prev => prev.filter(n => n.id !== data.requestId));
      }
    });

    return () => {
      socket.off('table:requestBill');
      socket.off('table:requestWater');
      socket.off('table:requestWaiter');
      socket.off('table:requestCleared');
    };
  }, [user?.restaurantId, socket]);

  const dismissNotification = async (id) => {
    if (!id) return;
    try {
      await clearTableRequest(id);
      socket.emit('table:clearRequest', { requestId: id, restaurantId: user?.restaurantId });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const getOrdersForTable = (tableId) => {
    return orders.filter(o => o.tableId === tableId && !['cancelled', 'paid'].includes(o.status));
  };

  const changeStatus = async (currentOrderId, status) => {
    try {
      await updateOrderStatus(currentOrderId, status);
      setOrders(prev =>
        prev.map(o =>
          o._id === currentOrderId
            ? { ...o, status, paymentStatus: status === 'paid' ? 'paid' : o.paymentStatus }
            : o
        )
      );
      setNotifications(prev => [{
        type: 'order',
        message: `Order marked as ${status} (Table ${selectedTable?.number})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        onDismiss: () => dismissNotification(0)
      }, ...prev]);
    } catch (e) {
      console.error(e);
    }
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
                    orders={getOrdersForTable(table._id)}
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
              <NotificationPanel 
                notifications={notifications} 
                onDismiss={dismissNotification}
              />
            </div>
          )}
        </div>

        {/* Order Modal */}
        {showOrderModal && selectedTable && (
          <div className="fixed inset-0 z-50 flex justify-center items-center md:items-start md:pt-16 bg-black bg-opacity-50">
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

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {getOrdersForTable(selectedTable._id).length > 0 ? (
                  <div className="space-y-6 flex flex-col">
                    {getOrdersForTable(selectedTable._id).map((order, orderIdx) => (
                      <div key={order._id} className="border border-gray-200 rounded-xl p-4 shadow-sm relative bg-white">
                        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-800 font-extrabold text-sm shadow-sm ring-2 ring-blue-50">
                          #{orderIdx + 1}
                        </div>
                        <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
                          <p className="text-sm font-semibold text-gray-800">
                            Status: <span className="capitalize px-2 py-0.5 rounded-md text-xs text-white" style={{
                              backgroundColor: order.status === 'ready' ? '#10b981' : order.status === 'pending' ? '#f59e0b' : '#3b82f6'
                            }}>{order.status}</span>
                          </p>
                          <p className="text-xs text-gray-500 font-mono">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <span className="font-bold text-gray-700 bg-gray-100 rounded px-1.5 py-0.5 text-xs h-fit font-mono shrink-0">×{item.qty}</span>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
                                {item.note && <p className="text-xs text-amber-600 italic mt-0.5 bg-amber-50 px-1.5 py-0.5 rounded">Note: {item.note}</p>}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                          <p className="text-sm font-bold text-gray-900">Total: ₹{order.totalAmount.toFixed(2)}</p>
                          {order.status === 'ready' && (
                            <button
                              onClick={() => changeStatus(order._id, 'served')}
                              className="bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm"
                            >
                              Serve Now 🍽️
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No active orders for this table</p>
                )}
                <div className="mt-6 sticky bottom-0 bg-white pt-2 border-t border-gray-50">
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* User Profile Drawer */}
        <UserProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
        <WaiterAlert 
          tableNumber={alertInfo?.tableNumber} 
          isVisible={!!alertInfo} 
          onDismiss={() => setAlertInfo(null)} 
        />
      </div>
    </ProtectedRoute>
  );
}
