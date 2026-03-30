// import { useState, useEffect } from 'react';

// /**
//  * Kitchen alert notification for new orders
//  */
// export const KitchenAlert = ({ tableNumber, isVisible, onDismiss }) => {
//   useEffect(() => {
//     if (isVisible) {
//       const timer = setTimeout(onDismiss, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [isVisible, onDismiss]);

//   if (!isVisible) return null;

//   return (
//     <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
//       <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg shadow-2xl text-center">
//         <div className="text-2xl font-bold">🔔 NEW ORDER</div>
//         <div className="text-lg font-semibold">Table {tableNumber}</div>
//       </div>
//     </div>
//   );
// };


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