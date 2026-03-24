import { useEffect, useState } from 'react';

/**
 * Kitchen display ticket showing order details
 * Animates in with slide effect on mount
 */
export const OrderTicket = ({ order, onStartCooking, onMarkReady }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    setIsAnimatingIn(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const borderColorClass = {
    pending: 'border-4 border-yellow-400',
    cooking: 'border-4 border-blue-400',
    ready: 'border-4 border-green-400'
  }[order.status] || 'border-4 border-gray-400';

  return (
    <div
      className={`bg-gray-800 text-white p-4 rounded-lg transition-all duration-500 transform ${
        isAnimatingIn ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      } ${borderColorClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">Table {order.tableNumber}</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-300">⏱️</div>
          <div className="text-lg font-mono text-yellow-300">{formatTime(elapsedTime)}</div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-gray-700 p-3 rounded mb-4 space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="font-bold text-yellow-300 text-lg min-w-8">×{item.qty}</span>
            <div className="flex-1">
              <p className="font-bold">{item.name}</p>
              {item.note && (
                <p className="text-sm text-yellow-200 italic bg-yellow-900 px-2 py-1 rounded mt-1">
                  {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="bg-yellow-900 text-yellow-100 p-3 rounded mb-4 text-sm">
          📝 {order.specialInstructions}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => onStartCooking(order.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold py-2 rounded transition-colors duration-200"
          >
            Start Cooking
          </button>
        )}
        {order.status === 'cooking' && (
          <button
            onClick={() => onMarkReady(order.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 font-bold py-2 rounded transition-colors duration-200"
          >
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <div className="flex-1 bg-green-600 font-bold py-2 rounded text-center">
            ✓ Ready for Pickup
          </div>
        )}
      </div>
    </div>
  );
};
