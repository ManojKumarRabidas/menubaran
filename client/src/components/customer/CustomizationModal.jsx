import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';

/**
 * Bottom sheet modal for customizing items before adding to cart
 */
export const CustomizationModal = ({ item, isOpen, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  if (!isOpen || !item) return null;

  const handleAddToCart = () => {
    onAddToCart(item, qty, note);
    setQty(1);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-t-lg md:rounded-lg w-full md:w-96 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">{item.name}</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:opacity-80"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Item Details */}
          <div>
            <div
              className={`h-48 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} rounded-lg flex items-center justify-center mb-4`}
            >
              <span className="text-6xl opacity-50">🍽️</span>
            </div>
            <p className="text-gray-600 text-sm">{item.description}</p>
            <p className="text-2xl font-bold text-orange-600 mt-2">${item.price.toFixed(2)}</p>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-2 w-fit">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="bg-white px-3 py-1 rounded font-bold hover:bg-gray-200 transition"
              >
                −
              </button>
              <span className="font-bold text-lg w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="bg-white px-3 py-1 rounded font-bold hover:bg-gray-200 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Special Instructions</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., extra spicy, no onions..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
              rows="3"
            ></textarea>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
