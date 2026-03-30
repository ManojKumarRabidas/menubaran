import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { OrderStatusTracker } from '../../components/customer/OrderStatusTracker.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { useSocketEmit, useSocketOn, useSocket } from '../../hooks/useSocket.js';
import { getOrderById, getOrdersByTable } from '../../services/api.js';

// ── Status badge helper ───────────────────────────────────────────────────────
const STATUS_STYLE = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cooking: 'bg-orange-100 text-orange-800 border-orange-200',
  ready: 'bg-green-100  text-green-800  border-green-200',
  served: 'bg-blue-100   text-blue-800   border-blue-200',
  cancelled: 'bg-red-100    text-red-800    border-red-200',
  paid: 'bg-gray-100   text-gray-600   border-gray-200',
};
const STATUS_LABEL = {
  pending: '⏳ Pending',
  cooking: '🔥 Cooking',
  ready: '✅ Ready',
  served: '🍽️ Served',
  cancelled: '❌ Cancelled',
  paid: '💳 Paid',
};

export default function OrderTrackingPage() {
  const { orderId } = useParams();             // present when coming from CartPage
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { socket } = useSocket();
  const { emitWithDelay } = useSocketEmit();

  // Both modes share these from query-string
  const tableId = searchParams.get('table');
  const restaurantId = searchParams.get('restaurant') || '';

  // ── Mode: single order ────────────────────────────────────────────────────
  const [order, setOrder] = useState(null);

  // ── Mode: table view (all active orders) ─────────────────────────────────
  const [tableOrders, setTableOrders] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Which mode are we in?
  const isTableView = !orderId && !!tableId;

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadSingleOrder = useCallback(async () => {
    try {
      const response = await getOrderById(orderId);
      setOrder(response.data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const loadTableOrders = useCallback(async () => {
    try {
      const response = await getOrdersByTable(tableId);
      setTableOrders(response.data || []);
      setActiveIndex(0);
    } catch {
      setTableOrders([]);
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    if (isTableView) loadTableOrders();
    else loadSingleOrder();
  }, [isTableView, loadSingleOrder, loadTableOrders]);

  // ── Socket: live status updates ───────────────────────────────────────────
  useSocketOn('order:statusUpdate', (data) => {
    // Update single order view
    setOrder(prev =>
      prev && prev._id === data.orderId
        ? { ...prev, status: data.newStatus, statusHistory: [...(prev.statusHistory || []), { status: data.newStatus, timestamp: new Date() }] }
        : prev
    );
    // Update table view
    setTableOrders(prev =>
      prev.map(o =>
        o._id === data.orderId
          ? { ...o, status: data.newStatus, statusHistory: [...(o.statusHistory || []), { status: data.newStatus, timestamp: new Date() }] }
          : o
      )
    );
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleRequestBill = (targetOrder) => {
    emitWithDelay('table:requestBill', {
      tableId,
      tableNumber: targetOrder?.tableNumber,
      restaurantId: targetOrder?.restaurantId || restaurantId,
    }, 100);
    showToast('Bill request sent! 💳');
  };

  const handleOrderAgain = () => navigate(`/menu/${restaurantId}/table/${tableId}`);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-amber-600" />
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TABLE VIEW: all active orders for this table
  // ═════════════════════════════════════════════════════════════════════════
  if (isTableView) {
    if (tableOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
          <span className="text-6xl">🍽️</span>
          <h1 className="text-2xl font-bold text-gray-800">No active orders</h1>
          <p className="text-gray-500 text-sm text-center">
            There are no pending orders for this table right now.
          </p>
          {restaurantId && tableId && (
            <button
              onClick={handleOrderAgain}
              className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition"
            >
              Browse Menu
            </button>
          )}
        </div>
      );
    }

    const currentOrder = tableOrders[activeIndex];

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {toast && (
            <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center animate-pulse">{toast}</div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
            {currentOrder?.tableNumber && (
              <p className="text-gray-500 text-sm mt-1">Table {currentOrder.tableNumber}</p>
            )}
          </div>

          {/* Order tabs if multiple orders */}
          {tableOrders.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {tableOrders.map((o, idx) => (
                <button
                  key={o._id}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${idx === activeIndex
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300'
                    }`}
                >
                  Order {idx + 1}
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status] || ''}`}>
                    {STATUS_LABEL[o.status] || o.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Current order card */}
          <OrderCard
            order={currentOrder}
            onRequestBill={() => handleRequestBill(currentOrder)}
            onOrderAgain={handleOrderAgain}
          />
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // SINGLE ORDER VIEW (after placing a new order from CartPage)
  // ═════════════════════════════════════════════════════════════════════════
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <button
            onClick={() => restaurantId && tableId ? navigate(`/menu/${restaurantId}/table/${tableId}`) : navigate('/')}
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {toast && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center animate-pulse">{toast}</div>
        )}
        <OrderCard
          order={order}
          onRequestBill={() => handleRequestBill(order)}
          onOrderAgain={handleOrderAgain}
        />
      </div>
    </div>
  );
}

// ── Shared order card component ───────────────────────────────────────────────
function OrderCard({ order, onRequestBill, onOrderAgain }) {
  return (
    <div>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Order #{String(order._id).slice(-6).toUpperCase()}
        </h1>
        <p className="text-gray-500 text-sm">
          Table {order.tableNumber} &bull; {new Date(order.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Status tracker */}
      <div className="mb-8">
        <OrderStatusTracker order={order} />
      </div>

      {/* Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                {item.note && <p className="text-sm text-gray-500 italic">{item.note}</p>}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-700">×{item.qty}</span>
                <span className="font-bold text-orange-600">₹{(item.price * item.qty).toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-300 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-orange-600">₹{order.totalAmount.toFixed(0)}</span>
        </div>
      </div>

      {/* Special instructions */}
      {order.specialInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Special Instructions:</span> {order.specialInstructions}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {order.status === 'served' && (
          <button
            onClick={onRequestBill}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            💳 Request Bill
          </button>
        )}
        <button
          onClick={onOrderAgain}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          🍽️ Add More Items
        </button>
      </div>
    </div>
  );
}
