import { useState } from 'react';
import { updateTable, addTable } from '../../services/api.js';

const STATUS_STYLES = {
  free: { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: '✓', label: 'Free' },
  occupied: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', icon: '👤', label: 'Occupied' },
  'bill-requested': { bg: 'bg-amber-50 border-amber-300', badge: 'bg-amber-100 text-amber-700', icon: '🧾', label: 'Bill Req.' },
  'water-requested': { bg: 'bg-cyan-50 border-cyan-200', badge: 'bg-cyan-100 text-cyan-700', icon: '💧', label: 'Water Req.' },
};

/**
 * Tables Manager — visual grid with status, rename, add table, order summary
 */
export const TablesManager = ({ tables = [], orders = [], restaurantId, onToast, onTablesChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [editNumber, setEditNumber] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [addingTable, setAddingTable] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');

  const getOrderForTable = (tableId) => orders.find(o => o.tableId === tableId && o.status !== 'paid');

  const startEdit = (table) => { setEditingId(table.id); setEditNumber(String(table.number)); };
  const cancelEdit = () => { setEditingId(null); setEditNumber(''); };

  const saveEdit = async (table) => {
    const num = parseInt(editNumber);
    if (!num || num <= 0) { onToast?.('Enter a valid table number', 'error'); return; }
    await updateTable(table.id, { number: num });
    onTablesChange(prev => prev.map(t => t.id === table.id ? { ...t, number: num } : t));
    onToast?.(`Table renamed to Table ${num}`, 'success');
    cancelEdit();
  };

  const freeTable = async (table) => {
    await updateTable(table.id, { status: 'free', currentOrderId: null });
    onTablesChange(prev => prev.map(t => t.id === table.id ? { ...t, status: 'free', currentOrderId: null } : t));
    onToast?.(`Table ${table.number} marked as free`, 'info');
  };

  const handleAddTable = async () => {
    const num = parseInt(newTableNumber);
    if (!num || num <= 0) { onToast?.('Enter a valid table number', 'error'); return; }
    const res = await addTable(restaurantId, num);
    onTablesChange(prev => [...prev, res.data]);
    onToast?.(`Table ${num} added!`, 'success');
    setAddingTable(false); setNewTableNumber('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900">Table Management</h3>
          <p className="text-sm text-gray-500">{tables.length} tables total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Legend */}
          {Object.entries(STATUS_STYLES).map(([key, val]) => (
            <span key={key} className={`text-xs font-semibold px-2 py-1 rounded-full ${val.badge}`}>{val.icon} {val.label}</span>
          ))}
          <button
            onClick={() => setAddingTable(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
          >+ Add Table</button>
        </div>
      </div>

      {/* Add Table Form */}
      {addingTable && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-sm font-semibold text-indigo-700">New Table Number:</span>
          <input
            type="number" value={newTableNumber} onChange={e => setNewTableNumber(e.target.value)}
            placeholder="e.g. 7"
            className="w-24 px-3 py-1.5 border border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            autoFocus
          />
          <button onClick={handleAddTable} className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">Add</button>
          <button onClick={() => { setAddingTable(false); setNewTableNumber(''); }} className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-300 transition">Cancel</button>
        </div>
      )}

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(table => {
          const style = STATUS_STYLES[table.status] || STATUS_STYLES.free;
          const order = getOrderForTable(table.id);
          const isExpanded = expandedId === table.id;
          const isEditing = editingId === table.id;

          return (
            <div key={table.id} className={`rounded-2xl border-2 ${style.bg} transition`}>
              {/* Table Card */}
              <div
                className="p-4 cursor-pointer select-none"
                onClick={() => setExpandedId(isExpanded ? null : table.id)}
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
                  <div className="text-center">
                    <p className="font-extrabold text-gray-900 text-lg">T{table.number}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
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
                      <p className="text-xs font-bold text-indigo-600">Total: ${order.totalAmount.toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 text-center">No active order</p>
                  )}
                  <div className="flex gap-1 pt-1">
                    <button onClick={() => startEdit(table)} className="flex-1 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-200 transition">✏️ Rename</button>
                    {table.status !== 'free' && (
                      <button onClick={() => freeTable(table)} className="flex-1 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition">Free</button>
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
