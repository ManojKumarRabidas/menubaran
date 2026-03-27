import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar.jsx';
import { MenuItemCard } from '../../components/customer/MenuItemCard.jsx';
import { CategoryTabs } from '../../components/customer/CategoryTabs.jsx';
import { CartDrawer } from '../../components/customer/CartDrawer.jsx';
import { CustomizationModal } from '../../components/customer/CustomizationModal.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { useSocketEmit } from '../../hooks/useSocket.js';
import { useCart } from '../../context/CartContext.jsx';
import {
  getRestaurantById,
  getCategoriesByRestaurantId,
  getMenuByRestaurantId,
  getTableById,
} from '../../services/api.js';

export default function MenuPage() {
  // URL params: /menu/:restaurantId/table/:tableId
  // e.g. /menu/rest_1/table/table_3
  const { restaurantId, tableId } = useParams();
  const navigate = useNavigate();
  const { emitWithDelay } = useSocketEmit();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [restaurantRes, tableRes, categoriesRes, itemsRes] = await Promise.all([
          getRestaurantById(restaurantId),
          getTableById(restaurantId, tableId),
          getCategoriesByRestaurantId(restaurantId),
          getMenuByRestaurantId(restaurantId),
        ]);

        if (!restaurantRes.data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setRestaurant(restaurantRes.data);
        setCategories(categoriesRes.data);
        setItems(itemsRes.data);

        // Table number from table data, fallback to parsing tableId
        if (tableRes.data) {
          setTableNumber(tableRes.data.number);
        } else {
          const num = tableId.replace(/[^0-9]/g, '');
          setTableNumber(parseInt(num, 10) || 1);
        }

        if (categoriesRes.data.length > 0) {
          setSelectedCategoryId(categoriesRes.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load menu data:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [restaurantId, tableId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item, qty) => {
    for (let i = 0; i < qty; i++) {
      addItem(item._id, item.name, item.price, 1);
    }
    showToast(`${item.name} added to cart!`, 'success');
  };

  const handleRequestWater = () => {
    emitWithDelay('table:requestWater', { tableId, tableNumber, restaurantId }, 100);
    showToast('💧 Water request sent!', 'info');
  };

  const handleCallWaiter = () => {
    emitWithDelay('table:callWaiter', { tableId, tableNumber, restaurantId }, 100);
    showToast('🔔 Waiter is on the way!', 'info');
  };

  const handleCartClick = () => {
    navigate('/cart', { state: { restaurantId, tableId, tableNumber } });
  };

  const filteredItems = selectedCategoryId
    ? items.filter(i => i.categoryId === selectedCategoryId)
    : items;

  /* ───────── Loading ───────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
        <LoadingSpinner size="lg" className="text-amber-600" />
        <p className="text-gray-500 text-sm font-medium">Loading menu…</p>
      </div>
    );
  }

  /* ───────── Not Found ───────── */
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4 px-4">
        <span className="text-6xl">🍽️</span>
        <h1 className="text-2xl font-bold text-gray-800">Restaurant not found</h1>
        <p className="text-gray-500 text-sm text-center">
          The QR code may be invalid or this restaurant is no longer active.
        </p>
      </div>
    );
  }

  /* ───────── Page ───────── */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Navbar */}
      <Navbar restaurantName={restaurant?.name} tableNumber={tableNumber} />

      {/* Sticky Category Tabs */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300 ${toast.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-blue-600 text-white'
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Main Menu Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-36">
        {filteredItems.length > 0 ? (
          <>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-4">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredItems.map(item => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  onAddClick={handleAddItem}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-5xl">🍽️</span>
            <p className="text-gray-500 text-base font-medium">No items in this category</p>
          </div>
        )}
      </main>

      {/* Fixed Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] px-4 py-3">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={handleRequestWater}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-100 active:scale-95 transition-all duration-150"
          >
            💧 Water
          </button>
          <button
            onClick={handleCallWaiter}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl font-semibold text-sm hover:bg-purple-100 active:scale-95 transition-all duration-150"
          >
            🔔 Waiter
          </button>
          <button
            onClick={() => navigate(`/order?table=${tableId}&restaurant=${restaurantId}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-100 active:scale-95 transition-all duration-150"
          >
            📋 My Orders
          </button>
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartDrawer onCartClick={handleCartClick} />

      {/* Customization Modal */}
      <CustomizationModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
