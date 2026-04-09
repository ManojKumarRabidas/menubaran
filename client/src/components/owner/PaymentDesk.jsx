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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-gray-900">Pending Payments</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{unpaidOrders.length} orders awaiting desk</p>
          </div>
          <div className="hidden sm:block px-4 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-wider">
            Mock Desk Mode
          </div>
        </div>

        {unpaidOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <p className="text-5xl mb-3">🎉</p>
            <p className="font-bold text-gray-700 text-lg">All orders have been paid!</p>
            <p className="text-sm text-gray-500 mt-1">No pending payments</p>
          </div>
        ) : (
          unpaidOrders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-900">T{order.tableNumber}</div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Order #{order._id.substring(0, 8)}</p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${order.status === 'bill-requested' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 my-3 lg:my-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-600 font-medium">{item.name} <span className="text-gray-400 font-bold ml-1">×{item.qty}</span></span>
                        <span className="text-gray-400 font-semibold">₹{(item.price * item.qty).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  {order.specialInstructions && (
                    <div className="text-[10px] text-amber-700 font-bold bg-amber-50 inline-block px-2 py-1 rounded-lg">📣 {order.specialInstructions}</div>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:min-w-[140px] pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-black text-indigo-600 leading-none mb-1">₹{order.totalAmount.toFixed(2)}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                      Started {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => openPayment(order)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                  >Pay Now</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Panel: Summary + History */}
      <div className="space-y-4">
        {/* Revenue Summary */}
        {/* Revenue Summary */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">Today's Collections</p>
            <p className="text-4xl font-black mb-1">₹{totalPaidToday.toFixed(0)}</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-indigo-200 text-[10px] font-bold uppercase">{paidOrders.length} successful payments</p>
            </div>
          </div>
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
