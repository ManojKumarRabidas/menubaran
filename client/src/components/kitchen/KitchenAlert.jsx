import { useState, useEffect } from 'react';

/**
 * Kitchen alert notification for new orders
 */
export const KitchenAlert = ({ tableNumber, isVisible, onDismiss }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg shadow-2xl text-center">
        <div className="text-2xl font-bold">🔔 NEW ORDER</div>
        <div className="text-lg font-semibold">Table {tableNumber}</div>
      </div>
    </div>
  );
};
