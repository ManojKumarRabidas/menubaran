import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateTable, addTable, clearTableRequest } from '../../services/api.js';
import { useSocket } from '../../hooks/useSocket.js';

const STATUS_STYLES = {
  free: { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: '✓', label: 'Free' },
  occupied: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '👤', label: 'Occupied' },
  'bill-requested': { bg: 'bg-amber-50 border-amber-300', badge: 'bg-amber-100 text-amber-700', icon: '🧾', label: 'Bill Req.' },
  'water-requested': { bg: 'bg-cyan-50 border-cyan-200', badge: 'bg-cyan-100 text-cyan-700', icon: '💧', label: 'Water Req.' },
};

/**
 * Tables Manager — visual grid with status, rename, add table, QR generation
 */
export const TablesManager = ({ tables = [], orders = [], requests = [], restaurantId, onToast, onTablesChange, onRequestsChange }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editNumber, setEditNumber] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [addingTable, setAddingTable] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');

  const getOrderForTable = (tableId) => orders.find(o => o.tableId === tableId && o.status !== 'paid');

  const startEdit = (table) => { setEditingId(table._id); setEditNumber(String(table.number)); };
  const cancelEdit = () => { setEditingId(null); setEditNumber(''); };

  const saveEdit = async (table) => {
    const num = parseInt(editNumber);
    if (!num || num <= 0) { onToast?.('Enter a valid table number', 'error'); return; }
    await updateTable(table._id, { number: num });
    onTablesChange(prev => prev.map(t => t._id === table._id ? { ...t, number: num } : t));
    onToast?.(`Table renamed to Table ${num}`, 'success');
    cancelEdit();
  };

  const freeTable = async (table) => {
    await updateTable(table._id, { status: 'free', currentOrderId: null });
    onTablesChange(prev => prev.map(t => t._id === table._id ? { ...t, status: 'free', currentOrderId: null } : t));
    onToast?.(`Table ${table.number} marked as free`, 'info');
  };

  const clearRequestsForTable = async (tableId) => {
    const tableRequests = requests.filter(r => r.tableId === tableId);
    if (tableRequests.length === 0) return;

    try {
      await Promise.all(tableRequests.map(r => clearTableRequest(r._id)));
      tableRequests.forEach(r => {
        socket.emit('table:clearRequest', { requestId: r._id, restaurantId });
      });
      onRequestsChange(prev => prev.filter(r => r.tableId !== tableId));
      onToast?.('Requests cleared', 'success');
    } catch (err) {
      onToast?.('Failed to clear requests', 'error');
    }
  };

  const handleAddTable = async () => {
    const num = parseInt(newTableNumber);
    if (!num || num <= 0) { onToast?.('Enter a valid table number', 'error'); return; }
    const res = await addTable(restaurantId, num);
    onTablesChange(prev => [...prev, res.data]);
    onToast?.(`Table ${num} added!`, 'success');
    setAddingTable(false); setNewTableNumber('');
  };

  const handleGenerateQR = (e, table) => {
    e.stopPropagation();
    const url = `/qr/${restaurantId}/${table._id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-gray-900">Table Management</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{tables.length} tables total</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <div className="flex flex-wrap gap-1.5 order-2 sm:order-1">
            {Object.entries(STATUS_STYLES).map(([key, val]) => (
              <span key={key} className={`text-[10px] font-black uppercase tracking-tight px-3 py-1 rounded-lg flex items-center gap-1 border ${val.badge}`}>{val.icon} {val.label}</span>
            ))}
          </div>
          <button
            onClick={() => setAddingTable(true)}
            className="w-full sm:w-auto order-1 sm:order-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
          >+ New Table</button>
        </div>
      </div>

      {/* Add Table Form */}
      {addingTable && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-black text-indigo-700 uppercase tracking-widest whitespace-nowrap">Table #:</span>
            <input
              type="number" value={newTableNumber} onChange={e => setNewTableNumber(e.target.value)}
              placeholder="e.g. 7"
              className="flex-1 sm:w-24 px-4 py-2 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
              autoFocus
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleAddTable} className="flex-1 sm:flex-none px-8 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 shadow-md transition-all active:scale-95">Add</button>
            <button onClick={() => { setAddingTable(false); setNewTableNumber(''); }} className="flex-1 sm:flex-none px-6 py-2 bg-white border border-gray-200 text-gray-500 rounded-xl text-sm font-black hover:bg-gray-50 transition-all active:scale-95">Cancel</button>
          </div>
        </div>
      )}

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(table => {
          const style = STATUS_STYLES[table.status] || STATUS_STYLES.free;
          const order = getOrderForTable(table._id);
          const isExpanded = expandedId === table._id;
          const isEditing = editingId === table._id;

          return (
            <div key={table._id} className={`rounded-2xl border-2 ${style.bg} transition`}>
              {/* Table Card */}
              <div
                className="p-4 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : table._id)}
              >
                <div className="text-3xl text-center mb-2">🪑</div>
                {isEditing ? (
                  <div className="text-center" onClick={e => e.stopPropagation()}>
                    <input
                      type="number" value={editNumber} onChange={e => setEditNumber(e.target.value)}
                      className="w-full px-2 py-1 text-center border border-indigo-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button onClick={() => saveEdit(table)} className="flex-1 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold">✓</button>
                      <button onClick={cancelEdit} className="flex-1 py-1 bg-gray-300 text-gray-700 rounded-lg text-xs font-bold">✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center relative">
                    <p className="font-extrabold text-gray-900 text-lg">T{table.number}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
                    
                    {/* Active Request Icons */}
                    <div className="absolute -top-10 -right-2 flex flex-col gap-1 items-center">
                      {requests.filter(r => r.tableId === table._id).map(r => (
                        <span key={r._id} className="text-lg animate-bounce" title={`${r.type} requested`}>
                          {r.type === 'water' ? '💧' : r.type === 'waiter' ? '🔔' : '🧾'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Detail */}
              {isExpanded && !isEditing && (
                <div className="border-t border-gray-200 p-3 space-y-2" onClick={e => e.stopPropagation()}>
                  {order ? (
                    <>
                      <p className="text-xs font-bold text-gray-700">Current Order:</p>
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-gray-600">• {item.name} × {item.qty}</p>
                      ))}
                      <p className="text-xs font-bold text-indigo-600">Total: ₹{order.totalAmount.toFixed(0)}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 text-center">No active order</p>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-1 pt-1 flex-col">
                    {/* QR Code Button */}
                    <button
                      onClick={(e) => handleGenerateQR(e, table)}
                      className="w-full py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition flex items-center justify-center gap-1"
                    >
                      📱 Generate QR Code
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(table)} className="flex-1 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition">✏️ Rename</button>
                      {table.status !== 'free' && (
                        <button onClick={() => freeTable(table)} className="flex-1 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition">✓ Free</button>
                      )}
                    </div>
                    {requests.some(r => r.tableId === table._id) && (
                      <button
                        onClick={() => clearRequestsForTable(table._id)}
                        className="w-full py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition"
                      >
                        ✨ Clear Requests
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
