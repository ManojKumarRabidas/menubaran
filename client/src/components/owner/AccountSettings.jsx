import { useState } from 'react';
import { restaurants, subscriptionPlans, staff } from '../../data/data.js';

const LOGO_COLORS = [
  { value: 'from-amber-600 to-orange-500', label: 'Amber-Orange' },
  { value: 'from-red-600 to-orange-500', label: 'Red-Orange' },
  { value: 'from-purple-600 to-indigo-500', label: 'Purple-Indigo' },
  { value: 'from-blue-600 to-cyan-500', label: 'Blue-Cyan' },
  { value: 'from-emerald-600 to-green-500', label: 'Emerald-Green' },
  { value: 'from-pink-600 to-rose-500', label: 'Pink-Rose' },
];

const TOGGLE = ({ on, onChange, label }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${on ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-1'}`}></span>
    </button>
  </div>
);

/**
 * Account & Settings panel — combined component used in two tabs
 */
export const AccountSettings = ({ restaurant: restaurantProp, restaurantId, onToast, tab = 'account' }) => {
  const restaurant = restaurantProp || restaurants.find(r => r.id === restaurantId) || {};
  const restaurantStaff = staff.filter(s => s.restaurantId === restaurantId);
  const plan = subscriptionPlans.find(p => p.name.toLowerCase() === restaurant.subscriptionPlan) || subscriptionPlans[1];

  const [form, setForm] = useState({
    name: restaurant.name || '',
    tagline: restaurant.tagline || '',
    address: restaurant.address || '',
    logoColor: restaurant.logoPlaceholderColor || LOGO_COLORS[0].value,
  });
  const [saving, setSaving] = useState(false);
  const [notifs, setNotifs] = useState({ newOrders: true, payments: true, lowStock: false, dailyReport: true });
  const [theme, setTheme] = useState('auto');

  const saveAccount = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    // Apply to in-memory data
    Object.assign(restaurant, { name: form.name, tagline: form.tagline, address: form.address, logoPlaceholderColor: form.logoColor });
    onToast?.('Restaurant profile updated!', 'success');
    setSaving(false);
  };

  if (tab === 'settings') return (
    <div className="space-y-6">
      {/* Subscription */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Subscription Plan</h3>
        <div className={`rounded-2xl p-5 border-2 ${plan?.isPopular ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-xl text-gray-900">{plan?.name}</h4>
                {plan?.isPopular && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">Most Popular</span>}
              </div>
              <p className="text-3xl font-extrabold text-indigo-600 mt-1">${plan?.price}<span className="text-base text-gray-500 font-normal">/mo</span></p>
            </div>
            <div className="text-right">
              <div className="w-3 h-3 rounded-full bg-emerald-400 inline-block mr-1"></div>
              <span className="text-sm font-semibold text-emerald-700 capitalize">{restaurant.subscriptionStatus}</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            {plan?.features?.map(f => (
              <p key={f} className="text-sm text-gray-700 flex items-center gap-2"><span className="text-emerald-500">✓</span>{f}</p>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition">Upgrade Plan</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Notification Preferences</h3>
        <div>
          <TOGGLE label="New Order Alerts" on={notifs.newOrders} onChange={v => setNotifs(n => ({ ...n, newOrders: v }))} />
          <TOGGLE label="Payment Confirmations" on={notifs.payments} onChange={v => setNotifs(n => ({ ...n, payments: v }))} />
          <TOGGLE label="Low Stock Warnings" on={notifs.lowStock} onChange={v => setNotifs(n => ({ ...n, lowStock: v }))} />
          <TOGGLE label="Daily Revenue Report" on={notifs.dailyReport} onChange={v => setNotifs(n => ({ ...n, dailyReport: v }))} />
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Appearance</h3>
        <p className="text-sm text-gray-500 mb-3">Theme preference</p>
        <div className="flex gap-3">
          {['light', 'dark', 'auto'].map(t => (
            <button
              key={t}
              onClick={() => { setTheme(t); onToast?.(`Theme set to ${t}`, 'info'); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition ${theme === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '⚙️'} {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Restaurant Profile */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-5">Restaurant Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${form.logoColor} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-extrabold text-2xl">{form.name?.[0] || '?'}</span>
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-lg">{form.name}</p>
            <p className="text-sm text-gray-500">{form.tagline}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Restaurant Name</label>
            <input
              type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Tagline</label>
            <input
              type="text" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Address</label>
            <input
              type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Logo Color</label>
            <div className="flex flex-wrap gap-2">
              {LOGO_COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setForm(f => ({ ...f, logoColor: c.value }))}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.value} transition ${form.logoColor === c.value ? 'ring-3 ring-offset-2 ring-indigo-600 scale-110' : 'hover:scale-105'}`}
                  title={c.label}
                ></button>
              ))}
            </div>
          </div>
          <button
            onClick={saveAccount}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
          >
            {saving ? <><span className="animate-spin">⟳</span> Saving…</> : '✓ Save Changes'}
          </button>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Staff Members</h3>
        <div className="space-y-3">
          {restaurantStaff.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className={`w-10 h-10 rounded-full ${s.avatarColor} flex items-center justify-center text-white font-extrabold flex-shrink-0`}>
                {s.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500">{s.email}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${
                s.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                s.role === 'waiter' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>{s.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
