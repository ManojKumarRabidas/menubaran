// import { useState } from 'react';
// import { updateOrderStatus } from '../../services/api.js';

// const STATUS_CONFIG = {
//   pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
//   cooking: { color: 'bg-blue-100 text-blue-800', label: 'Cooking' },
//   ready: { color: 'bg-green-100 text-green-700', label: 'Ready' },
//   served: { color: 'bg-gray-100 text-gray-700', label: 'Served' },
//   paid: { color: 'bg-emerald-100 text-emerald-700', label: 'Paid' },
// };
// const PAY_CONFIG = {
//   paid: { color: 'bg-emerald-100 text-emerald-700', icon: '✓' },
//   unpaid: { color: 'bg-red-100 text-red-600', icon: '!' },
// };
// const ORDER_STATUSES = ['pending', 'cooking', 'ready', 'served', 'paid'];

// /**
//  * Full Orders Panel — expandable rows, payment status, status change, filter
//  */
// export const OrdersPanel = ({ orders = [], onToast, onOrdersChange }) => {
//   const [filter, setFilter] = useState('all');
//   const [expandedId, setExpandedId] = useState(null);

//   const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
//   const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   const changeStatus = async (order, status) => {
//     await updateOrderStatus(order._id, status);
//     onOrdersChange(prev => prev.map(o => o._id === order._id ? { ...o, status, paymentStatus: status === 'paid' ? 'paid' : o.paymentStatus } : o));
//     onToast?.(`Order ${order._id.substring(0, 8)} → ${status}`, 'success');
//   };

//   const markPaid = async (order) => {
//     await updateOrderStatus(order._id, 'paid');
//     onOrdersChange(prev => prev.map(o => o._id === order._id ? { ...o, status: 'paid', paymentStatus: 'paid' } : o));
//     onToast?.('Order marked as paid', 'success');
//   };

//   return (
//     <div className="space-y-4">
//       {/* Filter Bar */}
//       <div className="bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-2 items-center">
//         <span className="text-sm font-semibold text-gray-600 mr-2">Filter:</span>
//         {['all', ...ORDER_STATUSES].map(s => (
//           <button
//             key={s}
//             onClick={() => setFilter(s)}
//             className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
//           >{s === 'all' ? `All (${orders.length})` : `${s} (${orders.filter(o => o.status === s).length})`}</button>
//         ))}
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-2xl shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Table</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
//                 <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {sorted.map(order => {
//                 const isExpanded = expandedId === order._id;
//                 const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.served;
//                 const pc = PAY_CONFIG[order.paymentStatus] || PAY_CONFIG.unpaid;
//                 return (
//                   <>
//                     <tr
//                       key={order._id}
//                       className="hover:bg-gray-50 transition cursor-pointer"
//                       onClick={() => setExpandedId(isExpanded ? null : order._id)}
//                     >
//                       <td className="px-4 py-3 text-xs font-mono text-gray-500">{order._id.substring(0, 8)}…</td>
//                       <td className="px-4 py-3 text-sm font-bold text-gray-900">T{order.tableNumber}</td>
//                       <td className="px-4 py-3 text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
//                       <td className="px-4 py-3 text-sm font-extrabold text-indigo-600">₹{order.totalAmount.toFixed(2)}</td>
//                       <td className="px-4 py-3">
//                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`text-xs font-bold px-2 py-1 rounded-full ${pc.color}`}>{pc.icon} {order.paymentStatus || 'unpaid'}</span>
//                       </td>
//                       <td className="px-4 py-3 text-xs text-gray-500">
//                         {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </td>
//                       <td className="px-4 py-3 flex gap-1" onClick={e => e.stopPropagation()}>
//                         {/* Quick status next step */}
//                         {order.status === 'pending' && <button onClick={() => changeStatus(order, 'cooking')} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition whitespace-nowrap">→ Cook</button>}
//                         {order.status === 'cooking' && <button onClick={() => changeStatus(order, 'ready')} className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition whitespace-nowrap">→ Ready</button>}
//                         {order.status === 'ready' && <button onClick={() => changeStatus(order, 'served')} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition whitespace-nowrap">→ Serve</button>}
//                         {order.status !== 'paid' && order.paymentStatus !== 'paid' && (
//                           <button onClick={() => markPaid(order)} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition whitespace-nowrap">✓ Paid</button>
//                         )}
//                         <button className="text-gray-400 ml-1">{isExpanded ? '▲' : '▼'}</button>
//                       </td>
//                     </tr>
//                     {/* Expanded Detail Row */}
//                     {isExpanded && (
//                       <tr key={`${order._id}-detail`} className="bg-indigo-50">
//                         <td colSpan="8" className="px-4 py-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Order Items</p>
//                               <div className="space-y-1.5">
//                                 {order.items.map((item, i) => (
//                                   <div key={i} className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
//                                     <div>
//                                       <p className="text-sm font-semibold text-gray-900">{item.name}</p>
//                                       {item.note && <p className="text-xs text-gray-500 italic">{item.note}</p>}
//                                     </div>
//                                     <div className="text-right">
//                                       <p className="text-xs text-gray-500">× {item.qty}</p>
//                                       <p className="text-sm font-bold text-indigo-600">₹{(item.price * item.qty).toFixed(2)}</p>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                             <div className="space-y-3">
//                               <div className="bg-white rounded-lg p-3">
//                                 <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Order Summary</p>
//                                 <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span></div>
//                                 {order.tipAmount > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Tip</span><span className="font-semibold">₹{order.tipAmount.toFixed(2)}</span></div>}
//                                 {order.specialInstructions && <p className="text-xs text-amber-600 mt-2">📝 {order.specialInstructions}</p>}
//                               </div>
//                               <div className="bg-white rounded-lg p-3">
//                                 <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Status Timeline</p>
//                                 <div className="space-y-1">
//                                   {order.statusHistory?.map((h, i) => (
//                                     <div key={i} className="flex items-center gap-2 text-xs">
//                                       <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
//                                       <span className="capitalize font-semibold text-gray-700">{h.status}</span>
//                                       <span className="text-gray-400">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//         {sorted.length === 0 && (
//           <div className="p-12 text-center text-gray-400">
//             <p className="text-4xl mb-3">📋</p>
//             <p className="font-semibold">No orders found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


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
  paid: { color: 'bg-emerald-100 text-emerald-700', icon: '✓' },
  unpaid: { color: 'bg-red-100 text-red-600', icon: '!' },
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

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * Full Orders Panel — date filter, table filter, status filter,
 * expandable rows, payment status, status change.
 *
 * @param {object[]} orders       - All orders for this restaurant
 * @param {Function} onToast      - Toast callback (message, type)
 * @param {Function} onOrdersChange - State setter for orders array
 */
export const OrdersPanel = ({ orders = [], onToast, onOrdersChange }) => {
  const today = toDateValue(new Date());

  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(today);      // default = today
  const [tableFilter, setTableFilter] = useState('');         // '' = all tables
  const [expandedId, setExpandedId] = useState(null);

  // ── Unique table numbers derived from orders (for the dropdown) ────────────
  const tableOptions = useMemo(() => {
    const nums = [...new Set(orders.map(o => o.tableNumber))].sort((a, b) => a - b);
    return nums;
  }, [orders]);

  // ── Chained filtering ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = orders;
    console.log("result", result)
    // 1. Date filter
    if (dateFilter) {
      result = result.filter(o => isSameDate(o.createdAt, dateFilter));
    }

    // 2. Table filter
    if (tableFilter !== '') {
      result = result.filter(o => String(o.tableNumber) === String(tableFilter));
    }

    // 3. Status filter
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }

    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, dateFilter, tableFilter, statusFilter]);

  // ── Status counts (scoped to date + table, ignoring status filter) ─────────
  const scopedOrders = useMemo(() => {
    let result = orders;
    if (dateFilter) result = result.filter(o => isSameDate(o.createdAt, dateFilter));
    if (tableFilter !== '') result = result.filter(o => String(o.tableNumber) === String(tableFilter));
    return result;
  }, [orders, dateFilter, tableFilter]);

  const countFor = (s) =>
    s === 'all' ? scopedOrders.length : scopedOrders.filter(o => o.status === s).length;

  // ── Actions ────────────────────────────────────────────────────────────────
  const changeStatus = async (order, status) => {
    await updateOrderStatus(order._id, status);
    onOrdersChange(prev =>
      prev.map(o =>
        o._id === order._id
          ? { ...o, status, paymentStatus: status === 'paid' ? 'paid' : o.paymentStatus }
          : o
      )
    );
    onToast?.(`Order ${order._id.substring(0, 8)} → ${status}`, 'success');
  };

  const markPaid = async (order) => {
    await updateOrderStatus(order._id, 'paid');
    onOrdersChange(prev =>
      prev.map(o =>
        o._id === order._id ? { ...o, status: 'paid', paymentStatus: 'paid' } : o
      )
    );
    onToast?.('Order marked as paid', 'success');
  };

  const clearFilters = () => {
    setDateFilter(today);
    setTableFilter('');
    setStatusFilter('all');
  };

  const isFiltered = dateFilter !== today || tableFilter !== '' || statusFilter !== 'all';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">

        {/* Row 1 — Date + Table + Clear */}
        <div className="flex flex-wrap gap-3 items-end">

          {/* Date Picker */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              📅 Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                max={today}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50
                           cursor-pointer transition hover:border-indigo-300"
              />
              {dateFilter === today && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white
                                 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  TODAY
                </span>
              )}
            </div>
          </div>

          {/* Table Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              🪑 Table
            </label>
            <select
              value={tableFilter}
              onChange={e => setTableFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50
                         cursor-pointer transition hover:border-indigo-300 min-w-[120px]"
            >
              <option value="">All Tables</option>
              {tableOptions.map(num => (
                <option key={num} value={num}>Table {num}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="self-end px-3 py-2 text-xs font-bold text-indigo-600
                         border border-indigo-200 rounded-xl hover:bg-indigo-50
                         transition flex items-center gap-1"
            >
              ✕ Reset Filters
            </button>
          )}

          {/* Live result count */}
          <div className="self-end ml-auto text-xs text-gray-400 font-semibold">
            Showing <span className="text-indigo-600">{filtered.length}</span> order{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Row 2 — Status Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          {['all', ...ORDER_STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition
                ${statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {s === 'all' ? `All (${countFor('all')})` : `${s} (${countFor(s)})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Orders Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Order', 'Table', 'Items', 'Total', 'Status', 'Payment', 'Time', 'Actions'].map(h => (
                  <th key={h}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => {
                const isExpanded = expandedId === order._id;
                const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.served;
                const pc = PAY_CONFIG[order.paymentStatus] || PAY_CONFIG.unpaid;

                return (
                  <>
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">
                        {order._id.substring(0, 8)}…
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        T{order.tableNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-sm font-extrabold text-indigo-600">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${sc.color}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${pc.color}`}>
                          {pc.icon} {order.paymentStatus || 'unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3 flex gap-1" onClick={e => e.stopPropagation()}>
                        {order.status === 'pending' && (
                          <button onClick={() => changeStatus(order, 'cooking')}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs
                                       font-bold hover:bg-blue-200 transition whitespace-nowrap">
                            → Cook
                          </button>
                        )}
                        {order.status === 'cooking' && (
                          <button onClick={() => changeStatus(order, 'ready')}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs
                                       font-bold hover:bg-green-200 transition whitespace-nowrap">
                            → Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button onClick={() => changeStatus(order, 'served')}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs
                                       font-bold hover:bg-gray-200 transition whitespace-nowrap">
                            → Serve
                          </button>
                        )}
                        {order.status !== 'paid' && order.paymentStatus !== 'paid' && (
                          <button onClick={() => markPaid(order)}
                            className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs
                                       font-bold hover:bg-emerald-200 transition whitespace-nowrap">
                            ✓ Paid
                          </button>
                        )}
                        <button className="text-gray-400 ml-1">
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>

                    {/* ── Expanded Detail Row ─────────────────────────── */}
                    {isExpanded && (
                      <tr key={`${order._id}-detail`} className="bg-indigo-50">
                        <td colSpan="8" className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Left: items */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                Order Items
                              </p>
                              <div className="space-y-1.5">
                                {order.items.map((item, i) => (
                                  <div key={i}
                                    className="flex justify-between items-center bg-white rounded-lg px-3 py-2">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                      {item.note && (
                                        <p className="text-xs text-gray-500 italic">{item.note}</p>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-gray-500">× {item.qty}</p>
                                      <p className="text-sm font-bold text-indigo-600">
                                        ₹{(item.price * item.qty).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Right: summary + timeline */}
                            <div className="space-y-3">
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">
                                  Order Summary
                                </p>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Subtotal</span>
                                  <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                {order.tipAmount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tip</span>
                                    <span className="font-semibold">₹{order.tipAmount.toFixed(2)}</span>
                                  </div>
                                )}
                                {order.specialInstructions && (
                                  <p className="text-xs text-amber-600 mt-2">
                                    📝 {order.specialInstructions}
                                  </p>
                                )}
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                                  Status Timeline
                                </p>
                                <div className="space-y-1">
                                  {order.statusHistory?.map((h, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                      <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                                      <span className="capitalize font-semibold text-gray-700">
                                        {h.status}
                                      </span>
                                      <span className="text-gray-400">
                                        {new Date(h.timestamp).toLocaleTimeString([], {
                                          hour: '2-digit', minute: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold">No orders found</p>
            <p className="text-xs mt-1">
              {dateFilter !== today
                ? `No orders on ${new Date(dateFilter + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : tableFilter !== ''
                  ? `No orders for Table ${tableFilter} today`
                  : 'No orders match the current filters'}
            </p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="mt-3 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-xl
                           text-xs font-bold hover:bg-indigo-200 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};