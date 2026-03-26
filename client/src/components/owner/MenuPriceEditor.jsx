import { useState } from 'react';

/**
 * Menu price editor table for owner dashboard
 */
export const MenuPriceEditor = ({ items = [], onSavePrice, onToast }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [unsavedIds, setUnsavedIds] = useState(new Set());

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditingPrice(item.price.toString());
  };

  const handleSave = (item) => {
    const newPrice = parseFloat(editingPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      onSavePrice(item._id, newPrice);
      setEditingId(null);
      setUnsavedIds(prev => {
        const next = new Set(prev);
        next.delete(item._id);
        return next;
      });
      onToast?.('Price updated!');
    }
  };

  const handlePriceChange = (e) => {
    setEditingPrice(e.target.value);
    setUnsavedIds(prev => new Set(prev).add(editingId));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Menu Price Editor</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Current Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr
                key={item._id}
                className={`hover:bg-gray-50 transition-colors ${unsavedIds.has(item._id) ? 'bg-amber-50' : ''
                  }`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.category || '—'}</td>
                <td className="px-6 py-4 text-sm font-mono">
                  {editingId === item._id ? (
                    <input
                      type="number"
                      value={editingPrice}
                      onChange={handlePriceChange}
                      step="0.01"
                      className="w-24 px-2 py-1 border border-indigo-600 rounded text-right focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      autoFocus
                    />
                  ) : (
                    `$${item.price.toFixed(2)}`
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {editingId === item._id ? (
                    <>
                      <button
                        onClick={() => handleSave(item)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="p-6 text-center text-gray-500">No menu items found</div>
      )}
    </div>
  );
};
