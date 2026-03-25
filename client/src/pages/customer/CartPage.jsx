import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { placeOrder } from '../../services/api.js';

const TAX_RATE = 0.05; // 5% GST

export default function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, getTotalAmount, setInstructions, specialInstructions, removeItem, updateQty, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [instructions, setLocalInstructions] = useState(specialInstructions);

  const { restaurantId = 'rest_1', tableId = 'table_1' } = location.state || {};

  const subtotal = getTotalAmount();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setToast('Cart is empty!');
      setTimeout(() => setToast(''), 2000);
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        restaurantSlug: restaurantId, // restaurantId is the real DB ID; api resolves via ID
        tableId,
        items: items.map(item => ({
          menuItemId: item.menuItemId,
          name: item.name,
          qty: item.qty,
          price: item.price,
          note: item.note || ''
        })),
        specialInstructions: instructions
      };

      const response = await placeOrder(orderPayload);
      setInstructions(instructions);
      clearCart();
      navigate(`/order/${response.data.id}?table=${tableId}&restaurant=${restaurantId}`);
    } catch (err) {
      setToast('Failed to place order');
      setTimeout(() => setToast(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
          <button
            onClick={() => navigate(`/menu/${restaurantId}/table/${tableId}`)}
            className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/menu/${restaurantId}/table/${tableId}`)}
            className="text-amber-600 font-semibold mb-4 hover:text-amber-700 flex items-center gap-1"
          >
            ← Back to Menu
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Order</h1>
        </div>

        {toast && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">
            {toast}
          </div>
        )}

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  {item.note && (
                    <p className="text-sm text-gray-600 italic">{item.note}</p>
                  )}
                  <p className="text-sm text-gray-500">₹{item.price.toFixed(0)} each</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item.menuItemId, item.qty - 1)}
                      className="px-2 py-1 font-bold hover:bg-gray-200 rounded transition"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-bold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.menuItemId, item.qty + 1)}
                      className="px-2 py-1 font-bold hover:bg-gray-200 rounded transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold text-lg text-orange-600 w-20 text-right">
                    ₹{(item.price * item.qty).toFixed(0)}
                  </p>

                  <button
                    onClick={() => removeItem(item.menuItemId)}
                    className="text-red-600 font-bold hover:text-red-700 px-2"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Order Notes</label>
          <textarea
            value={instructions}
            onChange={(e) => setLocalInstructions(e.target.value)}
            placeholder="E.g., no onions, extra spicy..."
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
            rows="3"
          ></textarea>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-3 mb-4 border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tax (5% GST)</span>
              <span className="font-semibold text-gray-900">₹{tax.toFixed(0)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-orange-600">₹{total.toFixed(0)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : '✓'}
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
