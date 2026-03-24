import { useCart } from '../../context/CartContext.jsx';

/**
 * Floating cart drawer showing items and total
 */
export const CartDrawer = ({ onCartClick }) => {
  const { items, getTotalAmount, getTotalItems } = useCart();

  if (items.length === 0) return null;

  const totalItems = getTotalItems();
  const totalAmount = getTotalAmount();

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 p-4 flex items-center gap-3"
    >
      <div className="flex flex-col items-center">
        <span className="text-2xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
      <div className="text-right hidden md:block">
        <div className="text-sm font-semibold">Cart</div>
        <div className="text-lg font-bold">${totalAmount.toFixed(2)}</div>
      </div>
    </button>
  );
};
