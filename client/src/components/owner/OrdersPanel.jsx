import { useState, useMemo } from 'react';
import { updateOrderStatus } from '../../services/api.js';

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  cooking: { color: 'bg-blue-100 text-blue-800', label: 'Cooking' },
  ready: { color: 'bg-green-100 text-green-700', label: 'Ready' },
  served: { color: 'bg-gray-100 text-gray-700', label: 'Served' },
  paid: { color: 'bg-emerald-100 text-emerald-700', label: 'Paid' },
};
const PAY_CONFIG = {
  paid: { status: "Paid", color: 'bg-emerald-100 text-emerald-700', icon: '✓' },
  unpaid: { status: "Unpaid", color: 'bg-red-100 text-red-600', icon: '!' },
};
const ORDER_STATUSES = ['pending', 'cooking', 'ready', 'served', 'paid'];

/** Returns "YYYY-MM-DD" for a given Date object (local time) */
const toDateValue = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/** Checks if a createdAt timestamp string falls on a given "YYYY-MM-DD" date */
const isSameDate = (createdAt, dateValue) => {
  return toDateValue(new Date(createdAt)) === dateValue;
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const OrderExpansionContent = ({ order }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Left: items */}
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
        Dish Details
      </p>
      <div className="space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between items-center bg-white border border-gray-100 rounded-xl px-3 py-2.5">
            <div>
              <p className="text-sm font-black text-gray-900">{item.name}</p>
              {item.note && <p className="text-[10px] text-amber-600 font-bold italic">{item.note}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400">× {item.qty}</p>
              <p className="text-sm font-black text-indigo-600">₹{(item.price * item.qty).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Right: summary + timeline */}
    <div className="space-y-3">
      <div className="bg-white border border-gray-100 rounded-xl p-3">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Summary</p>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500 font-bold">Subtotal</span>
          <span className="font-black text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
        </div>
        {order.specialInstructions && (
          <div className="mt-2 p-2 bg-amber-50 rounded-lg text-[10px] text-amber-700 font-bold">
            📣 {order.specialInstructions}
          </div>
        )}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-3">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Timeline</p>
        <div className="space-y-2">
          {order.statusHistory?.map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="capitalize font-black text-gray-700">{h.status}</span>
              <span className="text-gray-400 font-bold ml-auto">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const OrdersPanel = ({ orders = [], onToast, onOrdersChange }) => {
  const today = toDateValue(new Date());

  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(today);
  const [tableFilter, setTableFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const tableOptions = useMemo(() => {
    const nums = [...new Set(orders.map(o => o.tableNumber))].sort((a, b) => a - b);
    return nums;
  }, [orders]);

  const filtered = useMemo(() => {
    let result = orders;
    if (dateFilter) result = result.filter(o => isSameDate(o.createdAt, dateFilter));
    if (tableFilter !== '') result = result.filter(o => String(o.tableNumber) === String(tableFilter));
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, dateFilter, tableFilter, statusFilter]);

  const scopedOrders = useMemo(() => {
    let result = orders;
    if (dateFilter) result = result.filter(o => isSameDate(o.createdAt, dateFilter));
    if (tableFilter !== '') result = result.filter(o => String(o.tableNumber) === String(tableFilter));
    return result;
  }, [orders, dateFilter, tableFilter]);

  const countFor = (s) =>
    s === 'all' ? scopedOrders.length : scopedOrders.filter(o => o.status === s).length;

  const changeStatus = async (order, status) => {
    try {
      await updateOrderStatus(order._id, status);
      onOrdersChange(prev =>
        prev.map(o =>
          o._id === order._id
            ? { ...o, status, paymentStatus: status === 'paid' ? 'paid' : o.paymentStatus }
            : o
        )
      );
      onToast?.(`Order ${order._id.substring(0, 8)} → ${status}`, 'success');
    } catch (err) {
      onToast?.('Failed to update status', 'error');
    }
  };

  const markPaid = async (order) => {
    try {
      await updateOrderStatus(order._id, 'paid');
      onOrdersChange(prev =>
        prev.map(o =>
          o._id === order._id ? { ...o, status: 'paid', paymentStatus: 'paid' } : o
        )
      );
      onToast?.('Order marked as paid', 'success');
    } catch (err) {
      onToast?.('Failed to mark as paid', 'error');
    }
  };

  const clearFilters = () => {
    setDateFilter(today);
    setTableFilter('');
    setStatusFilter('all');
  };

  const isFiltered = dateFilter !== today || tableFilter !== '' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📅 Date</label>
              <div className="relative">
                <input
                  type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} max={today}
                  className="w-full border-2 border-gray-50 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 bg-gray-50 cursor-pointer transition hover:border-indigo-200"
                />
                {dateFilter === today && (
                   <span className="absolute -top-2 -right-1 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">TODAY</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🪑 Table</label>
              <select
                value={tableFilter} onChange={e => setTableFilter(e.target.value)}
                className="w-full border-2 border-gray-50 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 bg-gray-50 cursor-pointer transition hover:border-indigo-200"
              >
                <option value="">All Tables</option>
                {tableOptions.map(num => <option key={num} value={num}>Table {num}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="h-10 flex items-end">
              {isFiltered && (
                <button onClick={clearFilters} className="px-4 py-2 text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 rounded-xl hover:bg-indigo-100 active:scale-95 transition flex items-center gap-1.5">✕ Reset</button>
              )}
            </div>
            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <span className="text-indigo-600">{filtered.length}</span> Results
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:inline">Status:</span>
          {['all', ...ORDER_STATUSES].map(s => (
            <button
              key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${statusFilter === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {s === 'all' ? `All Items (${countFor('all')})` : `${s} (${countFor(s)})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders Listing ────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Date & Time', 'Order Id', 'Table', 'Items', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(order => {
                const isExpanded = expandedId === order._id;
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.served;
                const pc = PAY_CONFIG[order.paymentStatus] || PAY_CONFIG.unpaid;
                return (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                    <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">{order._id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900 border-l-2 border-indigo-500/10">T{order.tableNumber}</td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{order.items.length} dishes</td>
                    <td className="px-6 py-4 text-sm font-black text-indigo-600">₹{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${pc.color}`}>{pc.icon} {pc.status}</span>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                       <div className="flex gap-1.5">
                        {order.status === 'pending' && <button onClick={() => changeStatus(order, 'cooking')} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase hover:bg-blue-200">Cook</button>}
                        {order.status === 'cooking' && <button onClick={() => changeStatus(order, 'ready')} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-200">Ready</button>}
                        {order.status === 'ready' && <button onClick={() => changeStatus(order, 'served')} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-black uppercase hover:bg-gray-200">Serve</button>}
                        {order.status !== 'paid' && order.paymentStatus !== 'paid' && <button onClick={() => markPaid(order)} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-700 transition-colors">Paid</button>}
                        <button className="text-gray-300 ml-1">{isExpanded ? '▲' : '▼'}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden space-y-4">
          {filtered.map(order => {
            const isExpanded = expandedId === order._id;
            const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.served;
            const pc = PAY_CONFIG[order.paymentStatus] || PAY_CONFIG.unpaid;
            return (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                <div className="p-4" onClick={() => setExpandedId(isExpanded ? null : order._id)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600">T{order.tableNumber}</div>
                      <div>
                        <p className="text-xs font-black text-gray-900">Order #{order._id.substring(0, 8)}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-indigo-600">₹{order.totalAmount.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{order.items.length} Items</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-gray-50 pt-3">
                    <div className="flex gap-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-tight px-3 py-1 rounded-lg ${sc.color}`}>{sc.label}</span>
                      <span className={`text-[10px] font-black uppercase tracking-tight px-3 py-1 rounded-lg ${pc.color}`}>{pc.icon} {pc.status}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="bg-gray-50/50 border-t border-gray-100 p-4">
                    <OrderExpansionContent order={order} />
                    <div className="mt-4 flex flex-wrap gap-2">
                       {order.status === 'pending' && <button onClick={() => changeStatus(order, 'cooking')} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Cook</button>}
                       {order.status === 'cooking' && <button onClick={() => changeStatus(order, 'ready')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Ready</button>}
                       {order.status === 'ready' && <button onClick={() => changeStatus(order, 'served')} className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Serve</button>}
                       {order.status !== 'paid' && order.paymentStatus !== 'paid' && <button onClick={() => markPaid(order)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">✓ Paid</button>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
            <p className="text-4xl mb-4">📋</p>
            <p className="font-black uppercase tracking-widest text-xs">No orders found</p>
            {isFiltered && <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">Clear Filters</button>}
          </div>
        )}
      </div>
    </div>
  );
};