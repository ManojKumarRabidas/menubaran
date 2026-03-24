import { useState } from 'react';
import { updateMenuItem } from '../../services/api.js';

const EMOJIS = ['🍕','🍔','🌮','🍜','🍣','🥗','🍗','🥩','🍝','🥘','🫕','🍛','🍞','🥐','🧆','🍱','🥟','🍢','🫔','🧇'];

/**
 * Full Menu Editor component — edit name, price, image, availability. Bulk price update.
 */
export const MenuEditor = ({ items = [], categories = [], onToast, onItemsChange }) => {
  const [activeCat, setActiveCat] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkPct, setBulkPct] = useState('');
  const [emojiPicker, setEmojiPicker] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = items.filter(item => {
    const matchCat = activeCat === 'all' || item.categoryId === activeCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditDraft({ name: item.name, price: item.price, emoji: item.emoji || '🍽️', isAvailable: item.isAvailable });
  };

  const cancelEdit = () => { setEditingId(null); setEditDraft({}); setEmojiPicker(null); };

  const saveEdit = async (item) => {
    const name = editDraft.name?.trim();
    const price = parseFloat(editDraft.price);
    if (!name || isNaN(price) || price <= 0) {
      onToast?.('Please enter valid name and price', 'error'); return;
    }
    await updateMenuItem(item.id, { name, price, emoji: editDraft.emoji, isAvailable: editDraft.isAvailable });
    onItemsChange(prev => prev.map(i => i.id === item.id ? { ...i, name, price, emoji: editDraft.emoji, isAvailable: editDraft.isAvailable } : i));
    onToast?.('Item updated!', 'success');
    cancelEdit();
  };

  const toggleAvailability = async (item) => {
    const next = !item.isAvailable;
    await updateMenuItem(item.id, { isAvailable: next });
    onItemsChange(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: next } : i));
    onToast?.(next ? `${item.name} is now available` : `${item.name} marked unavailable`, 'info');
  };

  const applyBulkPrice = async () => {
    const pct = parseFloat(bulkPct);
    if (isNaN(pct)) { onToast?.('Enter a valid percentage', 'error'); return; }
    const toUpdate = filtered.map(item => ({
      ...item,
      price: Math.round(item.price * (1 + pct / 100) * 100) / 100
    }));
    await Promise.all(toUpdate.map(item => updateMenuItem(item.id, { price: item.price })));
    onItemsChange(prev => prev.map(i => {
      const updated = toUpdate.find(u => u.id === i.id);
      return updated ? { ...i, price: updated.price } : i;
    }));
    onToast?.(`Prices updated by ${pct > 0 ? '+' : ''}${pct}%`, 'success');
    setBulkMode(false); setBulkPct('');
  };

  const STATUS_COLORS = {
    true: 'bg-emerald-100 text-emerald-700',
    false: 'bg-red-100 text-red-600'
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCat('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeCat === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${activeCat === cat.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
        {/* Bulk edit */}
        {!bulkMode ? (
          <button
            onClick={() => setBulkMode(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition flex items-center gap-2"
          >
            <span>⚡</span> Bulk Price Edit
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <span className="text-sm text-amber-700 font-medium">Adjust by</span>
            <input
              type="number" value={bulkPct} onChange={e => setBulkPct(e.target.value)}
              placeholder="e.g. -10 or +5"
              className="w-24 px-2 py-1 border border-amber-300 rounded-lg text-sm focus:outline-none"
            />
            <span className="text-sm text-amber-700">%</span>
            <button onClick={applyBulkPrice} className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition">Apply</button>
            <button onClick={() => { setBulkMode(false); setBulkPct(''); }} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition">Cancel</button>
          </div>
        )}
      </div>

      {/* Item Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(item => {
          const isEditing = editingId === item.id;
          const cat = categories.find(c => c.id === item.categoryId);
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden border-2 transition ${isEditing ? 'border-indigo-400' : 'border-transparent hover:border-gray-200'}`}
            >
              {/* Card Header - Image/Emoji */}
              <div className={`h-28 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} flex items-center justify-center relative`}>
                <span className="text-5xl">{item.emoji || '🍽️'}</span>
                {/* Availability badge */}
                <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[item.isAvailable]}`}>
                  {item.isAvailable ? '✓ Available' : '✗ Unavailable'}
                </span>
                {cat && (
                  <span className="absolute bottom-2 left-2 text-xs bg-black/30 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {cat.icon} {cat.name}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    {/* Emoji picker */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Image (emoji)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl cursor-pointer border rounded-lg p-1" onClick={() => setEmojiPicker(emojiPicker === item.id ? null : item.id)}>
                          {editDraft.emoji || '🍽️'}
                        </span>
                        <span className="text-xs text-gray-500">click to change</span>
                      </div>
                      {emojiPicker === item.id && (
                        <div className="flex flex-wrap gap-1 mt-2 bg-gray-50 rounded-xl p-2 max-h-24 overflow-y-auto">
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => { setEditDraft(d => ({ ...d, emoji: e })); setEmojiPicker(null); }}
                              className="text-2xl hover:scale-125 transition">{e}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Item Name</label>
                      <input
                        type="text" value={editDraft.name}
                        onChange={e => setEditDraft(d => ({ ...d, name: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Price ($)</label>
                      <input
                        type="number" value={editDraft.price} step="0.01"
                        onChange={e => setEditDraft(d => ({ ...d, price: e.target.value }))}
                        className="w-full px-3 py-1.5 border border-indigo-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-gray-500">Available</label>
                      <button
                        onClick={() => setEditDraft(d => ({ ...d, isAvailable: !d.isAvailable }))}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${editDraft.isAvailable ? 'bg-emerald-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 bg-white rounded-full shadow transition-transform ${editDraft.isAvailable ? 'translate-x-5' : 'translate-x-1'}`}></span>
                      </button>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => saveEdit(item)} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">Save</button>
                      <button onClick={cancelEdit} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                      <span className="text-lg font-extrabold text-indigo-600 ml-2">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="flex-1 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition"
                      >✏️ Edit</button>
                      <button
                        onClick={() => toggleAvailability(item)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${item.isAvailable ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        {item.isAvailable ? '⊗ Disable' : '✓ Enable'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center text-gray-400">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="font-semibold">No items found</p>
        </div>
      )}
    </div>
  );
};
