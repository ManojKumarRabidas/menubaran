import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../components/common/ProtectedRoute.jsx';
import { SalesCard } from '../../components/owner/SalesCard.jsx';
import { PopularDishesChart } from '../../components/owner/PopularDishesChart.jsx';
import { RevenueChart } from '../../components/owner/RevenueChart.jsx';
import { DonutChart } from '../../components/owner/DonutChart.jsx';
import { MenuEditor } from '../../components/owner/MenuEditor.jsx';
import { TablesManager } from '../../components/owner/TablesManager.jsx';
import { OrdersPanel } from '../../components/owner/OrdersPanel.jsx';
import { PaymentDesk } from '../../components/owner/PaymentDesk.jsx';
import { AccountSettings } from '../../components/owner/AccountSettings.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useSocket } from '../../hooks/useSocket.js';
import {
  getOwnerStats, getMenuByRestaurant, getCategoriesByRestaurant,
  getTablesByRestaurant, getOrdersByRestaurant, getWeeklyRevenue,
  updateMenuItemPrice, getRestaurantById, getStaffByRestaurant,
  getPendingRequestsByRestaurant, clearTableRequest
} from '../../services/api.js';
import { restaurants, menuCategories } from '../../data/data.js';

const NAV_ITEMS = [
  { _id: 'overview', icon: '📊', label: 'Overview' },
  { _id: 'menu', icon: '🍽️', label: 'Menu Editor' },
  { _id: 'tables', icon: '🪑', label: 'Tables' },
  { _id: 'orders', icon: '📋', label: 'Orders' },
  { _id: 'payments', icon: '💳', label: 'Payments' },
  { _id: 'account', icon: '👤', label: 'Account' },
  { _id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function OwnerDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTabState] = useState(
    () => localStorage.getItem('dashboard_tab') || 'overview'
  );
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  // Close mobile menu on resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist active tab so refresh doesn't reset it
  const setActiveTab = (tab) => {
    localStorage.setItem('dashboard_tab', tab);
    setActiveTabState(tab);
  };

  const [stats, setStats] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTabFetching, setIsTabFetching] = useState(false);

  const [toast, setToast] = useState({ msg: '', type: '' });
  const [restaurant, setRestaurant] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  };


  const loadTabData = async () => {
    if (!user?.restaurantId) return;

    try {
      setIsTabFetching(true);
      const promises = [];

      // We always fetch orders for the pending payment badge and live tracking across all tabs
      promises.push(getOrdersByRestaurant(user.restaurantId).then(res => ({ key: 'orders', data: res?.data })).catch(e => { console.error('[FAIL] getOrders:', e); return { key: 'orders', data: null }; }));

      if (activeTab === 'overview') {
        promises.push(getOwnerStats(user.restaurantId).then(res => ({ key: 'stats', data: res?.data })).catch(e => ({ key: 'stats', data: null })));
        promises.push(getMenuByRestaurant(user.restaurantId).then(res => ({ key: 'menuItems', data: res?.data })).catch(e => ({ key: 'menuItems', data: null })));
        promises.push(getCategoriesByRestaurant(user.restaurantId).then(res => ({ key: 'categories', data: res?.data })).catch(e => ({ key: 'categories', data: null })));
        promises.push(getWeeklyRevenue(user.restaurantId).then(res => ({ key: 'weeklyRevenue', data: res?.data })).catch(e => ({ key: 'weeklyRevenue', data: null })));
      } else if (activeTab === 'menu') {
        promises.push(getMenuByRestaurant(user.restaurantId).then(res => ({ key: 'menuItems', data: res?.data })).catch(e => ({ key: 'menuItems', data: null })));
        promises.push(getCategoriesByRestaurant(user.restaurantId).then(res => ({ key: 'categories', data: res?.data })).catch(e => ({ key: 'categories', data: null })));
      } else if (activeTab === 'tables') {
        promises.push(getTablesByRestaurant(user.restaurantId).then(res => ({ key: 'tables', data: res?.data })).catch(e => ({ key: 'tables', data: null })));
        promises.push(getPendingRequestsByRestaurant(user.restaurantId).then(res => ({ key: 'requests', data: res?.data })).catch(e => ({ key: 'requests', data: null })));
      } else if (activeTab === 'account' || activeTab === 'settings') {
        promises.push(getStaffByRestaurant(user.restaurantId).then(res => ({ key: 'staffList', data: res?.data })).catch(e => ({ key: 'staffList', data: null })));
      }

      const results = await Promise.all(promises);

      results.forEach(({ key, data }) => {
        if (data !== null) {
          if (key === 'orders') setOrders(data);
          else if (key === 'stats') setStats(data);
          else if (key === 'menuItems') setMenuItems(data);
          else if (key === 'categories') setCategories(data);
          else if (key === 'weeklyRevenue') setWeeklyRevenue(data);
          else if (key === 'tables') setTables(data);
          else if (key === 'staffList') setStaffList(data);
          else if (key === 'requests') setRequests(data);
        }
      });

    } catch (e) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
      setIsTabFetching(false);
    }
  };

  const fetchRestaurant = async () => {
    if (!user?.restaurantId) return;
    try {
      let getRestaurant = await getRestaurantById(user.restaurantId);
      if (getRestaurant && getRestaurant.data) {
        setRestaurant(getRestaurant);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const socket = useSocket();

  useEffect(() => {
    if (!socket || !user?.restaurantId) return;

    const handleNewRequest = (data) => {
      if (data.restaurantId === user.restaurantId) {
        setRequests(prev => [
          {
            _id: data.requestId,
            type: data.type,
            tableId: data.tableId,
            tableNumber: data.tableNumber,
            createdAt: new Date(),
          },
          ...prev
        ]);
        showToast(`${data.type.charAt(0).toUpperCase() + data.type.slice(1)} requested - Table ${data.tableNumber}`, 'info');
      }
    };

    const handleRequestCleared = (data) => {
      if (data.restaurantId === user.restaurantId) {
        setRequests(prev => prev.filter(r => r._id !== data.requestId));
      }
    };

    socket.on('table:requestWater', (data) => handleNewRequest({ ...data, type: 'water' }));
    socket.on('table:requestWaiter', (data) => handleNewRequest({ ...data, type: 'waiter' }));
    socket.on('table:requestBill', (data) => handleNewRequest({ ...data, type: 'bill' }));
    socket.on('table:requestCleared', handleRequestCleared);

    return () => {
      socket.off('table:requestWater');
      socket.off('table:requestWaiter');
      socket.off('table:requestBill');
      socket.off('table:requestCleared');
    };
  }, [socket, user?.restaurantId]);

  useEffect(() => {
    fetchRestaurant();
  }, [user?.restaurantId]);

  useEffect(() => {
    if (user?.restaurantId) {
      loadTabData();
    }
  }, [activeTab, user?.restaurantId]);

  // Donut chart: revenue segments by category
  const donutSegments = (() => {
    const catRevenue = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const mi = menuItems.find(m => m._id === item.menuItemId);
        const cat = categories.find(c => c._id === mi?.categoryId);
        const label = cat ? `${cat.icon} ${cat.name}` : 'Other';
        catRevenue[label] = (catRevenue[label] || 0) + item.price * item.qty;
      });
    });
    return Object.entries(catRevenue).map(([label, value]) => ({ label, value: Math.round(value * 100) / 100 }));
  })();

  // Pending payment count badge
  const pendingPayCount = orders.filter(o => o.paymentStatus !== 'paid' && o.status !== 'paid' && (o.status === 'served' || o.status === 'bill-requested')).length;

  const toastStyles = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['owner']}>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-white">
          <LoadingSpinner size="lg" className="text-indigo-600" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* ─── Backdrop (Mobile Only) ─── */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* ─── Sidebar ─── */}
        <aside
          className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-2xl 
            ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} 
            ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
        >
          {/* Logo area */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${restaurant?.logoPlaceholderColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <span className="text-white font-extrabold text-base">{restaurant?.name?.[0] || 'M'}</span>
              </div>
              {(sidebarOpen || mobileMenuOpen) && (
                <div className="overflow-hidden">
                  <p className="font-extrabold text-sm leading-tight truncate">{restaurant?.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold truncate">Dashboard</p>
                </div>
              )}
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-white">✕</button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item._id;
              const badge = item._id === 'payments' && pendingPayCount > 0 ? pendingPayCount : null;
              const showText = sidebarOpen || mobileMenuOpen;
              
              return (
                <button
                  key={item._id}
                  onClick={() => handleTabChange(item._id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${isActive ? 'bg-indigo-600 shadow-indigo-900/40 shadow-lg text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span className={`text-xl flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`}>{item.icon}</span>
                  {showText && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                  {badge && (
                    <span className={`${showText ? 'ml-auto' : 'absolute -top-1 -right-1'} bg-red-500 text-white text-[10px] sm:text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-900 shadow-lg`}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Area */}
          <div className="p-3 border-t border-gray-700/50 space-y-1.5">
            <button
              onClick={() => { logout(); navigate('/staff/login'); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all group`}
            >
              <span className="text-xl flex-shrink-0 group-hover:rotate-12 transition-transform">🚪</span>
              {(sidebarOpen || mobileMenuOpen) && <span className="text-sm font-bold tracking-tight">Logout</span>}
            </button>

            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="hidden lg:flex w-full items-center gap-3 px-3 py-2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
              {sidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">Collapse Sidebar</span>}
            </button>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 
          ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="text-2xl">☰</span>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="hidden xs:inline">{NAV_ITEMS.find(n => n._id === activeTab)?.icon}</span>
                  {NAV_ITEMS.find(n => n._id === activeTab)?.label}
                </h1>
                <p className="hidden xs:block text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-wider">{restaurant?.name || 'MenuBaran'} • Owner</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isTabFetching && (
                <span className="hidden sm:flex items-center gap-1.5 text-sm text-indigo-500 font-semibold mr-2 animate-pulse">
                  ↻ Updating...
                </span>
              )}
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Live
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
                {user?.name?.[0] || 'O'}
              </div>
            </div>
          </header>

          {/* Toast */}
          {toast.msg && (
            <div className={`sticky top-[72px] z-20 mx-4 sm:mx-6 mt-4 ${toastStyles[toast.type] || 'bg-gray-700'} text-white px-4 py-3 rounded-2xl shadow-xl font-black text-xs sm:text-sm flex items-center gap-3 animate-in slide-in-from-top duration-300`}>
              <span className="text-lg">{toast.type === 'success' ? '🚀' : toast.type === 'error' ? '🚫' : '💡'}</span>
              {toast.msg}
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <SalesCard
                    icon="💰" label="Today's Revenue"
                    value={`₹${stats?.todayRevenue?.toFixed(2) || '0.00'}`}
                    gradient="from-indigo-500 to-purple-600"
                    trend={12} trendLabel="vs yesterday"
                  />
                  <SalesCard
                    icon="📦" label="Today's Orders"
                    value={stats?.totalOrders || 0} unit="orders"
                    gradient="from-emerald-500 to-teal-600"
                    trend={5} trendLabel="vs yesterday"
                  />
                  <SalesCard
                    icon="💵" label="Avg Order Value"
                    value={`₹${stats?.avgOrderValue?.toFixed(2) || '0.00'}`}
                    gradient="from-amber-400 to-orange-500"
                    trend={-3} trendLabel="vs last week"
                  />
                  <SalesCard
                    icon="⭐" label="Top Item"
                    value={stats?.mostPopularItem?.name || 'N/A'}
                    gradient="from-pink-500 to-rose-600"
                    subtitle={stats?.mostPopularItem?.orderCount ? `${stats.mostPopularItem.orderCount} orders` : ''}
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RevenueChart data={weeklyRevenue} />
                  </div>
                  <div>
                    <DonutChart segments={donutSegments.length > 0 ? donutSegments : [{ label: 'No data', value: 1 }]} />
                  </div>
                </div>

                {/* Popular Dishes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PopularDishesChart items={menuItems} />

                  {/* Live Orders Summary */}
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Live Orders</h3>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block"></span>
                    </div>
                    <div className="space-y-2">
                      {orders.filter(o => !['paid'].includes(o.status)).slice(0, 6).map(order => {
                        const statusColor = {
                          pending: 'bg-yellow-100 text-yellow-800',
                          cooking: 'bg-blue-100 text-blue-700',
                          ready: 'bg-green-100 text-green-700',
                          served: 'bg-gray-100 text-gray-600',
                        }[order.status] || 'bg-gray-100 text-gray-600';
                        return (
                          <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-gray-900 text-sm">T{order.tableNumber}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>{order.status}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-extrabold text-indigo-600">₹{order.totalAmount.toFixed(2)}</p>
                              <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        );
                      })}
                      {orders.filter(o => !['paid'].includes(o.status)).length === 0 && (
                        <p className="text-gray-400 text-center py-6 text-sm">No active orders</p>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="mt-4 w-full py-2 border-2 border-indigo-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition"
                    >View All Orders →</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── Menu Editor Tab ── */}
            {activeTab === 'menu' && (
              <MenuEditor
                items={menuItems}
                categories={categories}
                restaurantId={user?.restaurantId}
                onToast={showToast}
                onItemsChange={setMenuItems}
              />
            )}

            {/* ── Tables Tab ── */}
            {activeTab === 'tables' && (
              <TablesManager
                tables={tables}
                orders={orders}
                requests={requests}
                restaurantId={user?.restaurantId}
                onToast={showToast}
                onTablesChange={setTables}
                onRequestsChange={setRequests}
              />
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
              <OrdersPanel
                orders={orders}
                onToast={showToast}
                onOrdersChange={setOrders}
              />
            )}

            {/* ── Payments Tab ── */}
            {activeTab === 'payments' && (
              <PaymentDesk
                orders={orders}
                onToast={showToast}
                onOrdersChange={setOrders}
              />
            )}

            {/* ── Account Tab ── */}
            {activeTab === 'account' && (
              <AccountSettings
                restaurant={restaurant}
                restaurantId={user?.restaurantId}
                onToast={showToast}
                tab="account"
                staffList={staffList}
                onStaffChange={setStaffList}
              />
            )}

            {/* ── Settings Tab ── */}
            {activeTab === 'settings' && (
              <AccountSettings
                restaurant={restaurant}
                restaurantId={user?.restaurantId}
                onToast={showToast}
                tab="settings"
              />
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
