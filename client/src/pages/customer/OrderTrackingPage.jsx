import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { OrderStatusTracker } from '../../components/customer/OrderStatusTracker.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { useSocket, useSocketEmit } from '../../hooks/useSocket.js';
import { getOrderById, updateTableStatus } from '../../services/api.js';

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { socket } = useSocket();
  const { emitWithDelay } = useSocketEmit();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const tableId = searchParams.get('table');
  const restaurantSlug = searchParams.get('restaurant') || 'spice-garden';

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // Listen for status updates
  useEffect(() => {
    const handleStatusUpdate = (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({
          ...prev,
          status: data.newStatus,
          statusHistory: [...(prev?.statusHistory || []), { status: data.newStatus, timestamp: new Date() }]
        }));
      }
    };

    socket.on('order:statusUpdate', handleStatusUpdate);
    return () => {
      socket.off('order:statusUpdate', handleStatusUpdate);
    };
  }, [orderId, socket]);

  const handleRequestBill = async () => {
    emitWithDelay('table:requestBill', {
      tableId,
      tableNumber: order?.tableNumber,
      restaurantId: order?.restaurantId
    }, 100);

    setToast('Bill request sent! 💳');
    setTimeout(() => setToast(''), 2000);
  };

  const handleOrderAgain = () => {
    navigate(`/menu/${restaurantSlug}/table/${tableId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" className="text-amber-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <button
            onClick={() => navigate(`/menu/${restaurantSlug}/table/${tableId}`)}
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
          <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center animate-pulse">
            {toast}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id.split('_')[1]}</h1>
          <p className="text-gray-600">
            Table {order.tableNumber} • {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Status Tracker */}
        <div className="mb-8">
          <OrderStatusTracker order={order} />
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  {item.note && <p className="text-sm text-gray-600 italic">{item.note}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-700">×{item.qty}</span>
                  <span className="font-bold text-orange-600">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-orange-600">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
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
              onClick={handleRequestBill}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              💳 Request Bill
            </button>
          )}

          <button
            onClick={handleOrderAgain}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            🍽️ Order Again
          </button>
        </div>
      </div>
    </div>
  );
}
