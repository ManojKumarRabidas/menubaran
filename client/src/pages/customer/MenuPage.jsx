import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar.jsx';
import { MenuItemCard } from '../../components/customer/MenuItemCard.jsx';
import { CategoryTabs } from '../../components/customer/CategoryTabs.jsx';
import { CartDrawer } from '../../components/customer/CartDrawer.jsx';
import { CustomizationModal } from '../../components/customer/CustomizationModal.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { useSocket, useSocketEmit } from '../../hooks/useSocket.js';
import { useCart } from '../../context/CartContext.jsx';
import { getRestaurantBySlug, getCategoriesByRestaurant, getMenuByRestaurant, updateTableStatus } from '../../services/api.js';

export default function MenuPage() {
  const { restaurantSlug, tableId } = useParams();
  const navigate = useNavigate();
  const { emitWithDelay } = useSocketEmit();
  const { addItem } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const restaurantRes = await getRestaurantBySlug(restaurantSlug);
        const categoriesRes = await getCategoriesByRestaurant(restaurantSlug);
        const itemsRes = await getMenuByRestaurant(restaurantSlug);

        setRestaurant(restaurantRes.data);
        setCategories(categoriesRes.data);
        setItems(itemsRes.data);
        
        if (categoriesRes.data.length > 0) {
          setSelectedCategoryId(categoriesRes.data[0].id);
        }

        // Extract table number from tableId
        const num = tableId.replace('table_', '');
        setTableNumber(parseInt(num, 10) || 1);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    loadData();
  }, [restaurantSlug, tableId]);

  const handleAddItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item, qty, note) => {
    const itemWithNote = { ...item, note };
    for (let i = 0; i < qty; i++) {
      addItem(item.id, item.name, item.price, 1);
    }
    setToast(`${item.name} added to cart!`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRequestWater = async () => {
    emitWithDelay('table:requestWater', {
      tableId,
      tableNumber,
      restaurantId: restaurant?.id
    }, 100);
    setToast('Water request sent! 💧');
    setTimeout(() => setToast(''), 2000);
  };

  const handleCallWaiter = async () => {
    setToast('Waiter called! 🔔');
    setTimeout(() => setToast(''), 2000);
  };

  const handleCartClick = () => {
    navigate('/cart', { state: { restaurantSlug, tableId } });
  };

  const filteredItems = selectedCategoryId
    ? items.filter(i => i.categoryId === selectedCategoryId)
    : items;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-amber-50 to-white">
      <Navbar restaurantName={restaurant?.name} tableNumber={tableNumber} />

      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          {toast}
        </div>
      )}

      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onAddClick={handleAddItem}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items in this category</p>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 justify-center md:justify-start">
        <button
          onClick={handleRequestWater}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          💧 Request Water
        </button>
        <button
          onClick={handleCallWaiter}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
        >
          🔔 Call Waiter
        </button>
      </div>

      <CartDrawer onCartClick={handleCartClick} />
      <CustomizationModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
