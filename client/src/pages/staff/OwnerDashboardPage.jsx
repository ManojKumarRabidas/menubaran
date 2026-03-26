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
import {
  getOwnerStats, getMenuByRestaurant, getCategoriesByRestaurant,
  getTablesByRestaurant, getOrdersByRestaurant, getWeeklyRevenue,
  updateMenuItemPrice, getRestaurantById
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
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({ msg: '', type: '' });
  const [restaurant, setRestaurant] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3500);
  };


  const load = async () => {
    try {

      const [statsRes, menuRes, catRes, tablesRes, ordersRes, weekRes] = await Promise.all([
        getOwnerStats(user?.restaurantId).catch(e => { console.error('[FAIL] getOwnerStats:', e); return null; }),
        getMenuByRestaurant(user?.restaurantId).catch(e => { console.error('[FAIL] getMenuByRestaurant:', e); return null; }),
        getCategoriesByRestaurant(user?.restaurantId).catch(e => { console.error('[FAIL] getCategoriesByRestaurant:', e); return null; }),
        getTablesByRestaurant(user?.restaurantId).catch(e => { console.error('[FAIL] getTablesByRestaurant:', e); return null; }),
        getOrdersByRestaurant(user?.restaurantId).catch(e => { console.error('[FAIL] getOrdersByRestaurant:', e); return null; }),
        getWeeklyRevenue(user?.restaurantId).catch(e => { console.error('[FAIL] getWeeklyRevenue:', e); return null; }),
      ]);

      // Only set state if response is not null
      if (statsRes) setStats(statsRes.data);
      if (menuRes) setMenuItems(menuRes.data);
      if (catRes) setCategories(catRes.data);
      if (tablesRes) setTables(tablesRes.data);
      if (ordersRes) setOrders(ordersRes.data);
      if (weekRes) setWeeklyRevenue(weekRes.data);

    } catch (e) {
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false); // Now ALWAYS fires even if a call fails
    }
  };

  const fetchRestaurant = async () => {
    let getRestaurant = await getRestaurantById(user?.restaurantId) || null;
    if (getRestaurant && getRestaurant.data) {
      setRestaurant(getRestaurant);
      if (user?.restaurantId && getRestaurant?.data?.slug) {
        load();
      }
    }
  };
  useEffect(() => {
    fetchRestaurant();
  }, [user?.restaurantId, user]);

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
        {/* ─── Sidebar ─── */}
        <aside
          className={`fixed top-0 left-0 h-full z-30 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-2xl ${sidebarOpen ? 'w-56' : 'w-16'}`}
        >
          {/* Logo area */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-700">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${restaurant?.logoPlaceholderColor || 'from-indigo-500 to-purple-600'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <span className="text-white font-extrabold text-base">{restaurant?.name?.[0] || 'M'}</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-extrabold text-sm leading-tight truncate">{restaurant?.name}</p>
                <p className="text-gray-400 text-xs truncate">{restaurant?.tagline}</p>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const isActive = activeTab === item._id;
              const badge = item._id === 'payments' && pendingPayCount > 0 ? pendingPayCount : null;
              return (
                <button
                  key={item._id}
                  onClick={() => setActiveTab(item._id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive ? 'bg-indigo-600 shadow-md' : 'hover:bg-gray-700'
                    }`}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && <span className={`text-sm font-semibold transition ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{item.label}</span>}
                  {badge && (
                    <span className={`${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'} bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center`}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button
            onClick={() => { logout(); navigate('/staff/login'); }}
            className="mx-2 mb-2 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-600/20 text-red-400 hover:text-red-300 transition group"
          >
            <span className="text-xl flex-shrink-0">🚪</span>
            {sidebarOpen && <span className="text-sm font-semibold">Logout</span>}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-4 border-t border-gray-700 hover:bg-gray-700 transition flex items-center gap-3"
          >
            <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-gray-400 text-xs">Collapse</span>}
          </button>
        </aside>

        {/* ─── Main Content ─── */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-16'}`}>
          {/* Top Header */}
          <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                {NAV_ITEMS.find(n => n._id === activeTab)?.icon}{' '}
                {NAV_ITEMS.find(n => n._id === activeTab)?.label}
              </h1>
              <p className="text-xs text-gray-500">{restaurant?.name} • Owner Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
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
            <div className={`sticky top-14 z-30 mx-6 mt-4 ${toastStyles[toast.type] || 'bg-gray-700'} text-white px-4 py-3 rounded-xl shadow-lg font-semibold text-sm flex items-center gap-2 animate-bounce`}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'} {toast.msg}
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 p-6">
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
                restaurantId={user?.restaurantId}
                onToast={showToast}
                onTablesChange={setTables}
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
