import { useEffect, useState } from 'react';

const STATUS_CONFIG = {
  pending: {
    border: 'border-amber-300',
    badge: 'bg-amber-100 text-amber-700',
    label: '🕐 Pending',
    timer: true,
  },
  cooking: {
    border: 'border-blue-300',
    badge: 'bg-blue-100 text-blue-700',
    label: '🍳 Cooking',
    timer: true,
  },
  ready: {
    border: 'border-emerald-300',
    badge: 'bg-emerald-100 text-emerald-700',
    label: '✓ Ready',
    timer: true,
  },
  served: {
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-500',
    label: '✓ Served',
    timer: false,
  },
  paid: {
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-500',
    label: '✓ Paid',
    timer: false,
  },
};

export const OrderTicket = ({ order, onStartCooking, onMarkReady }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    const calculateTime = () => {
      const readyEvent = order.statusHistory?.find(h => h.status === 'ready');
      const endTime = readyEvent ? new Date(readyEvent.timestamp).getTime() : Date.now();
      const startTime = new Date(order.createdAt).getTime();
      return Math.max(0, Math.floor((endTime - startTime) / 1000));
    };

    setElapsedTime(calculateTime());

    if (['pending', 'cooking'].includes(order.status)) {
      const interval = setInterval(() => {
        setElapsedTime(calculateTime());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [order.createdAt, order.status, order.statusHistory]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return `${m}m ${sec}s`;
  };

  const getServedTime = () => {
    const servedEvent = order.statusHistory?.find(h => h.status === 'served');
    if (servedEvent) {
      return new Date(servedEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border-2 ${cfg.border} p-5 transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">Table {order.tableNumber}</h2>
          <span className={`inline-block mt-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        {cfg.timer && (
          <div className={`text-right ${order.status === 'ready' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'} border rounded-xl px-3 py-2`}>
            <p className={`text-xs ${order.status === 'ready' ? 'text-emerald-500' : 'text-amber-500'} font-semibold`}>{order.status === 'ready' ? 'Prep time' : 'Wait time'}</p>
            <p className={`text-lg font-extrabold ${order.status === 'ready' ? 'text-emerald-600' : 'text-amber-600'} font-mono`}>{formatTime(elapsedTime)}</p>
          </div>
        )}
        {order.status === 'served' && (
          <div className="text-right bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            <p className="text-xs text-blue-500 font-semibold">Served at</p>
            <p className="text-lg font-extrabold text-blue-600 font-mono">{getServedTime()}</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="bg-indigo-100 text-indigo-700 font-extrabold text-sm w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
              ×{item.qty}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
              {item.note && (
                <p className="text-xs text-amber-700 italic bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg mt-1">
                  📝 {item.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 rounded-xl mb-4 text-xs font-medium">
          ⚠️ {order.specialInstructions}
        </div>
      )}

      {/* Action Buttons */}
      {order.status === 'pending' && (
        <button
          onClick={() => onStartCooking(order._id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
          🍳 Start Cooking
        </button>
      )}
      {order.status === 'cooking' && (
        <button
          onClick={() => onMarkReady(order._id)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
          ✓ Mark Ready
        </button>
      )}
      {['ready', 'served', 'paid'].includes(order.status) && (
        <div className={`w-full text-center font-bold py-2.5 rounded-xl text-sm ${cfg.badge}`}>
          {cfg.label}
        </div>
      )}
    </div>
  );
};