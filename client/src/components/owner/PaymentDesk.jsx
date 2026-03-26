import { useState } from 'react';
import { processPayment } from '../../services/api.js';

const PAYMENT_METHODS = [
  { _id: 'cash', label: 'Cash', icon: '💵' },
  { _id: 'card', label: 'Card', icon: '💳' },
  { _id: 'upi', label: 'UPI', icon: '📱' },
];

/**
 * Payment Desk — process mock payments for unpaid orders at owner counter
 */
export const PaymentDesk = ({ orders = [], onToast, onOrdersChange }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [method, setMethod] = useState('cash');
  const [tip, setTip] = useState('');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const unpaidOrders = orders.filter(o => o.paymentStatus !== 'paid' && o.status !== 'paid');
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid' || o.status === 'paid');

  const openPayment = (order) => {
    setSelectedOrder(order);
    setMethod('cash');
    setTip('');
    setReceipt(null);
  };

  const confirmPayment = async () => {
    if (!selectedOrder) return;
    setProcessing(true);
    await new Promise(r => setTimeout(r, 900)); // simulate processing delay
    const tipAmt = parseFloat(tip) || 0;
    await processPayment(selectedOrder._id, method, tipAmt);
    const totalWithTip = selectedOrder.totalAmount + tipAmt;
    setReceipt({ order: selectedOrder, method, tip: tipAmt, total: totalWithTip });
    onOrdersChange(prev => prev.map(o => o._id === selectedOrder._id
      ? { ...o, paymentStatus: 'paid', paymentMethod: method, tipAmount: tipAmt, status: 'paid' }
      : o
    ));
    onToast?.('Payment processed successfully! 🎉', 'success');
    setProcessing(false);
    setSelectedOrder(null);
  };

  const totalPaidToday = paidOrders.reduce((s, o) => s + o.totalAmount + (o.tipAmount || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Unpaid Orders */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="font-bold text-gray-900 text-lg mb-1">Pending Payments</h3>
          <p className="text-sm text-gray-500">{unpaidOrders.length} order{unpaidOrders.length !== 1 ? 's' : ''} awaiting payment</p>
        </div>

        {unpaidOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-5xl mb-3">🎉</p>
            <p className="font-bold text-gray-700 text-lg">All orders have been paid!</p>
            <p className="text-sm text-gray-500 mt-1">No pending payments</p>
          </div>
        ) : (
          unpaidOrders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md p-5 border-l-4 border-amber-400">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-gray-900 text-lg">Table {order.tableNumber}</span>
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full capitalize">{order.status}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{order._id.substring(0, 12)}…</p>
                  <div className="mt-2 space-y-0.5">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-gray-600">• {item.name} × {item.qty} — ₹{(item.price * item.qty).toFixed(2)}</p>
                    ))}
                  </div>
                  {order.specialInstructions && (
                    <p className="text-xs text-amber-600 mt-1">📝 {order.specialInstructions}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-2xl font-extrabold text-indigo-600">₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mb-3">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  <button
                    onClick={() => openPayment(order)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-md"
                  >💳 Process Payment</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Panel: Summary + History */}
      <div className="space-y-4">
        {/* Revenue Summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-md p-5 text-white">
          <p className="text-indigo-200 text-sm font-semibold mb-1">Today's Collected</p>
          <p className="text-4xl font-extrabold">₹{totalPaidToday.toFixed(2)}</p>
          <p className="text-indigo-300 text-xs mt-2">{paidOrders.length} payments processed</p>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h4 className="font-bold text-gray-900 mb-3">Payment History</h4>
          {paidOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No payments yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {paidOrders.slice().reverse().map(order => (
                <div key={order._id} className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Table {order.tableNumber}</p>
                    <p className="text-xs text-gray-500 capitalize">₹{order.paymentMethod || 'cash'} {order.tipAmount > 0 ? `• +₹${order.tipAmount?.toFixed(2)} tip` : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-emerald-700">₹{(order.totalAmount + (order.tipAmount || 0)).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.paidAt ? new Date(order.paidAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <h3 className="text-xl font-extrabold">Process Payment</h3>
              <p className="text-indigo-200 text-sm mt-1">Table {selectedOrder.tableNumber} • {selectedOrder.items.length} items</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Order Items */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Order Details</p>
                <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} × {item.qty}</span>
                      <span className="font-semibold">₹{(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-extrabold">
                    <span>Subtotal</span>
                    <span className="text-indigo-600">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tip Input */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Add Tip</label>
                <div className="flex gap-2">
                  {[0, 5, 10, 15].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setTip(pct === 0 ? '' : (selectedOrder.totalAmount * pct / 100).toFixed(2))}
                      className="flex-1 py-1.5 bg-gray-100 rounded-xl text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >{pct === 0 ? 'No tip' : `${pct}%`}</button>
                  ))}
                </div>
                <input
                  type="number" value={tip} step="0.01"
                  onChange={e => setTip(e.target.value)}
                  placeholder="Custom tip amount"
                  className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payment Method</p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m._id}
                      onClick={() => setMethod(m._id)}
                      className={`py-3 rounded-xl text-sm font-bold transition flex flex-col items-center gap-1 ${method === m._id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-indigo-50 rounded-xl p-4 flex justify-between items-center">
                <span className="font-bold text-gray-700">Total Due</span>
                <span className="text-2xl font-extrabold text-indigo-700">
                  ₹{(selectedOrder.totalAmount + (parseFloat(tip) || 0)).toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  disabled={processing}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
                >Cancel</button>
                <button
                  onClick={confirmPayment}
                  disabled={processing}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="animate-spin">⟳</span> Processing…
                    </>
                  ) : (
                    <>✓ Confirm Payment</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
