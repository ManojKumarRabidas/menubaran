import { useCart } from '../../context/CartContext.jsx';

/**
 * Floating cart button – positioned above the fixed footer action bar
 */
export const CartDrawer = ({ onCartClick }) => {
  const { items, getTotalAmount, getTotalItems } = useCart();

  if (items.length === 0) return null;

  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-24 right-4 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 px-5 py-3 flex items-center gap-3"
    >
      {/* Cart icon with badge */}
      <div className="relative">
        <span className="text-2xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center leading-none shadow">
            {totalItems}
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="text-left">
        <div className="text-xs font-semibold opacity-90 leading-none mb-0.5">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </div>
        <div className="text-sm font-extrabold leading-none">₹{totalAmount.toFixed(0)}</div>
      </div>

      {/* Arrow */}
      <span className="text-sm opacity-80">→</span>
    </button>
  );
};
