import { useEffect } from 'react';

export const KitchenAlert = ({ tableNumber, isVisible, onDismiss }) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-white border-2 border-indigo-200 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 min-w-64">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-xl">🔔</span>
        </div>
        <div className="flex-1">
          <p className="font-extrabold text-gray-900 text-sm">New Order Arrived!</p>
          <p className="text-gray-500 text-xs">Table <span className="font-bold text-indigo-600">{tableNumber}</span> placed an order</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-300 hover:text-gray-500 transition text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};