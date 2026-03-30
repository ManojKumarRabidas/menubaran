import { useState, useRef } from 'react';
import { restaurants, subscriptionPlans, staff as initialStaff } from '../../data/data.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const LOGO_COLORS = [
  { value: 'from-amber-600 to-orange-500', label: 'Amber-Orange' },
  { value: 'from-red-600 to-orange-500', label: 'Red-Orange' },
  { value: 'from-purple-600 to-indigo-500', label: 'Purple-Indigo' },
  { value: 'from-blue-600 to-cyan-500', label: 'Blue-Cyan' },
  { value: 'from-emerald-600 to-green-500', label: 'Emerald-Green' },
  { value: 'from-pink-600 to-rose-500', label: 'Pink-Rose' },
];

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-purple-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
  'bg-orange-500', 'bg-teal-500',
];

const ROLES = ['cook', 'waiter', 'owner'];

const ROLE_STYLE = {
  owner: 'bg-purple-100 text-purple-700',
  waiter: 'bg-blue-100   text-blue-700',
  cook: 'bg-orange-100 text-orange-700',
};

const EMPTY_FORM = {
  name: '', email: '', password: '', role: 'waiter',
  avatarColor: AVATAR_COLORS[0],
};

// ─── Small helpers ─────────────────────────────────────────────────────────────
const Toggle = ({ on, onChange, label }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${on ? 'bg-indigo-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-5 w-5 bg-white rounded-full shadow transition-transform
        ${on ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  </div>
);

/** Floating modal backdrop + centered card */
const Modal = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

/** Inline validation helper */
const validate = (form, isEdit) => {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
  if (!isEdit && !form.password) errs.password = 'Password is required';
  if (!isEdit && form.password && form.password.length < 6)
    errs.password = 'Min 6 characters';
  if (!form.role) errs.role = 'Select a role';
  return errs;
};

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
const StaffFormModal = ({ member, onClose, onSave, existingEmails }) => {
  const isEdit = Boolean(member);
  const [form, setForm] = useState(member
    ? { name: member.name, email: member.email, password: '', role: member.role, avatarColor: member.avatarColor }
    : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSave = async () => {
    const errs = validate(form, isEdit);
    // Check duplicate email (excluding self)
    if (form.email && existingEmails.includes(form.email.toLowerCase()) &&
      (!isEdit || form.email.toLowerCase() !== member.email.toLowerCase())) {
      errs.email = 'This email is already registered';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    await new Promise(r => setTimeout(r, 500)); // simulate async
    onSave(form, isEdit ? member._id : null);
    setSaving(false);
    onClose();
  };

  const Field = ({ label, _id, error, children }) => (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition
     ${err ? 'border-red-300 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-indigo-400 bg-white'}`;

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${form.avatarColor} flex items-center justify-center
                           text-white font-extrabold text-lg shadow`}>
            {form.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg leading-tight">
              {isEdit ? 'Edit Staff Member' : 'Add New Staff'}
            </h3>
            <p className="text-xs text-gray-400">
              {isEdit ? `Editing ${member.name}` : 'Fill in all required fields'}
            </p>
          </div>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100
                     text-gray-400 transition text-lg leading-none">×</button>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <Field label="Full Name" error={errors.name}>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. Ravi Kumar" className={inputCls(errors.name)} />
        </Field>

        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="ravi@restaurant.com" className={inputCls(errors.email)} />
        </Field>

        <Field label={isEdit ? 'New Password (leave blank to keep)' : 'Password'} error={errors.password}>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder={isEdit ? '••••••  (unchanged)' : 'Min 6 characters'}
              className={inputCls(errors.password) + ' pr-10'}
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
        </Field>

        <Field label="Role" error={errors.role}>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(r => (
              <button key={r}
                onClick={() => set('role', r)}
                className={`py-2.5 rounded-xl text-sm font-bold capitalize transition border-2
                  ${form.role === r
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                {r === 'cook' ? '👨‍🍳' : r === 'waiter' ? '🧑‍💼' : '👑'} {r}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Avatar Color">
          <div className="flex flex-wrap gap-2 mt-1">
            {AVATAR_COLORS.map(c => (
              <button key={c} onClick={() => set('avatarColor', c)}
                className={`w-9 h-9 rounded-full ${c} transition
                  ${form.avatarColor === c
                    ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'}`}>
                {form.avatarColor === c && <span className="text-white text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex gap-3">
        <button onClick={onClose}
          className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold
                     text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                     rounded-xl text-sm font-bold hover:opacity-90 transition shadow-md
                     flex items-center justify-center gap-2 disabled:opacity-60">
          {saving
            ? <><span className="animate-spin inline-block">⟳</span> Saving…</>
            : isEdit ? '✓ Save Changes' : '+ Add Member'}
        </button>
      </div>
    </Modal>
  );
};

// ─── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ title, message, confirmLabel, confirmStyle, onConfirm, onClose }) => {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    onConfirm();
    setLoading(false);
    onClose();
  };
  return (
    <Modal onClose={onClose}>
      <div className="p-6 text-center">
        <div className="text-5xl mb-4">{confirmStyle === 'danger' ? '⚠️' : '💤'}</div>
        <h3 className="font-extrabold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-bold
                       text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={handle} disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition
                        flex items-center justify-center gap-2 disabled:opacity-60
                        ${confirmStyle === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-amber-500 hover:bg-amber-600'}`}>
            {loading ? <span className="animate-spin">⟳</span> : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Staff Row ─────────────────────────────────────────────────────────────────
const StaffRow = ({ member, onEdit, onDelete, onToggleActive }) => {
  const isInactive = member.isActive === false;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition
      ${isInactive
        ? 'bg-gray-50 border-gray-200 opacity-60'
        : 'bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm'}`}>

      {/* Avatar */}
      <div className={`relative w-10 h-10 rounded-full flex-shrink-0 flex items-center
                       justify-center text-white font-extrabold shadow
                       ${isInactive ? 'bg-gray-400' : member.avatarColor}`}>
        {member.name[0].toUpperCase()}
        {isInactive && (
          <span className="absolute -bottom-1 -right-1 bg-gray-500 text-white
                           text-[9px] font-bold px-1 rounded-full leading-4">OFF</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-semibold text-sm truncate ${isInactive ? 'text-gray-400' : 'text-gray-900'}`}>
            {member.name}
          </p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ROLE_STYLE[member.role]}`}>
            {member.role === 'cook' ? '👨‍🍳' : member.role === 'waiter' ? '🧑‍💼' : '👑'} {member.role}
          </span>
        </div>
        <p className="text-xs text-gray-400 truncate">{member.email}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Edit */}
        <button onClick={() => onEdit(member)}
          title="Edit"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100
                     hover:bg-indigo-100 hover:text-indigo-700 text-gray-500
                     transition text-sm">
          ✏️
        </button>

        {/* Active / Inactive toggle */}
        <button onClick={() => onToggleActive(member)}
          title={isInactive ? 'Activate' : 'Deactivate'}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition text-sm
            ${isInactive
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-600'}`}>
          {isInactive ? '▶' : '⏸'}
        </button>

        {/* Delete */}
        <button onClick={() => onDelete(member)}
          title="Delete"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100
                     hover:bg-red-100 hover:text-red-600 text-gray-500
                     transition text-sm">
          🗑️
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
/**
 * Account & Settings panel — restaurant profile + full staff CRUD
 * (add, edit, delete, activate/deactivate with confirmation)
 */
export const AccountSettings = ({
  restaurant: restaurantProp,
  restaurantId,
  onToast,
  tab = 'account',
}) => {
  console.log("restorent id", restaurantId);
  console.log("restorent prop", restaurantProp);
  const restaurant = restaurantProp.data || restaurants.find(r => r._id === restaurantId) || {};
  const plan = subscriptionPlans.find(p =>
    p.name.toLowerCase() === restaurant.subscriptionPlan
  ) || subscriptionPlans[1];

  // Staff state — seeded from data.js, managed locally until backend is ready
  // const [staffList, setStaffList] = useState(
  //   () => initialStaff
  //     .filter(s => s.restaurantId === restaurantId)
  //     .map(s => ({ ...s, isActive: s.isActive !== undefined ? s.isActive : true }))
  // );
  const [staffList, setStaffList] = useState([])
  // Modal states
  const [formModal, setFormModal] = useState(null);  // null | 'add' | staffMember object
  const [confirmModal, setConfirmModal] = useState(null);  // null | { type, member }

  // Profile form
  const [form, setForm] = useState({
    name: restaurant.name || '',
    tagline: restaurant.tagline || '',
    address: restaurant.address || '',
    logoColor: restaurant.logoPlaceholderColor || LOGO_COLORS[0].value,
  });
  const [saving, setSaving] = useState(false);

  // Settings state
  const [notifs, setNotifs] = useState({
    newOrders: true, payments: true, lowStock: false, dailyReport: true,
  });
  const [theme, setTheme] = useState('auto');

  // ── Staff CRUD handlers ────────────────────────────────────────────────────
  const handleSaveStaff = (formData, editId) => {
    if (editId) {
      // Update existing
      setStaffList(prev => prev.map(s =>
        s._id === editId
          ? {
            ...s,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            avatarColor: formData.avatarColor,
            ...(formData.password ? { password: formData.password } : {}),
          }
          : s
      ));
      onToast?.('Staff member updated!', 'success');
    } else {
      // Add new — generate a temp _id (backend will replace with real _id)
      const newMember = {
        _id: `temp-${Date.now()}`,
        restaurantId,
        name: formData.name,
        email: formData.email,
        password: formData.password, // hash in prod
        role: formData.role,
        avatarColor: formData.avatarColor,
        isActive: true,
      };
      setStaffList(prev => [...prev, newMember]);
      onToast?.(`${formData.name} added to staff!`, 'success');
    }
  };

  const handleDeleteConfirm = (member) => {
    setStaffList(prev => prev.filter(s => s._id !== member._id));
    onToast?.(`${member.name} removed from staff`, 'info');
  };

  const handleToggleActiveConfirm = (member) => {
    setStaffList(prev => prev.map(s =>
      s._id === member._id ? { ...s, isActive: !s.isActive } : s
    ));
    const action = member.isActive === false ? 'activated' : 'deactivated';
    onToast?.(`${member.name} ${action}`, 'info');
  };

  // Emails for duplicate check (excluding current edit target handled in modal)
  const existingEmails = staffList.map(s => s.email.toLowerCase());

  // ── Counts ─────────────────────────────────────────────────────────────────
  const activeCount = staffList.filter(s => s.isActive !== false).length;
  const inactiveCount = staffList.length - activeCount;

  // ─────────────────────────────────────────────────────────────────────────
  const saveAccount = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    Object.assign(restaurant, {
      name: form.name,
      tagline: form.tagline,
      address: form.address,
      logoPlaceholderColor: form.logoColor,
    });
    onToast?.('Restaurant profile updated!', 'success');
    setSaving(false);
  };

  // ── Settings tab ──────────────────────────────────────────────────────────
  if (tab === 'settings') return (
    <div className="space-y-6">
      {/* Subscription */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Subscription Plan</h3>
        <div className={`rounded-2xl p-5 border-2
          ${plan?.isPopular ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-xl text-gray-900">{plan?.name}</h4>
                {plan?.isPopular && (
                  <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="text-3xl font-extrabold text-indigo-600 mt-1">
                ${plan?.price}
                <span className="text-base text-gray-500 font-normal">/mo</span>
              </p>
            </div>
            <div className="text-right">
              <div className="w-3 h-3 rounded-full bg-emerald-400 inline-block mr-1" />
              <span className="text-sm font-semibold text-emerald-700 capitalize">
                {restaurant.subscriptionStatus}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            {plan?.features?.map(f => (
              <p key={f} className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-emerald-500">✓</span>{f}
              </p>
            ))}
          </div>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm
                             font-bold hover:bg-indigo-700 transition">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Notification Preferences</h3>
        <Toggle label="New Order Alerts" on={notifs.newOrders} onChange={v => setNotifs(n => ({ ...n, newOrders: v }))} />
        <Toggle label="Payment Confirmations" on={notifs.payments} onChange={v => setNotifs(n => ({ ...n, payments: v }))} />
        <Toggle label="Low Stock Warnings" on={notifs.lowStock} onChange={v => setNotifs(n => ({ ...n, lowStock: v }))} />
        <Toggle label="Daily Revenue Report" on={notifs.dailyReport} onChange={v => setNotifs(n => ({ ...n, dailyReport: v }))} />
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Appearance</h3>
        <p className="text-sm text-gray-500 mb-3">Theme preference</p>
        <div className="flex gap-3">
          {['light', 'dark', 'auto'].map(t => (
            <button key={t} onClick={() => { setTheme(t); onToast?.(`Theme set to ${t}`, 'info'); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold capitalize transition
                ${theme === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '⚙️'} {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Account tab ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Restaurant Profile */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-5">Restaurant Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${form.logoColor}
                           flex items-center justify-center shadow-lg`}>
            <span className="text-white font-extrabold text-2xl">{form.name?.[0] || '?'}</span>
          </div>
          <div>
            <p className="font-extrabold text-gray-900 text-lg">{form.name}</p>
            <p className="text-sm text-gray-500">{form.tagline}</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Restaurant Name', field: 'name', ph: 'Your restaurant name' },
            { label: 'Tagline', field: 'tagline', ph: 'Short catchy tagline' },
            { label: 'Address', field: 'address', ph: 'Full address' },
          ].map(({ label, field, ph }) => (
            <div key={field}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                {label}
              </label>
              <input type="text" value={form[field]} placeholder={ph}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          ))}

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
              Logo Color
            </label>
            <div className="flex flex-wrap gap-2">
              {LOGO_COLORS.map(c => (
                <button key={c.value} title={c.label}
                  onClick={() => setForm(f => ({ ...f, logoColor: c.value }))}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.value} transition
                    ${form.logoColor === c.value
                      ? 'ring-4 ring-offset-2 ring-indigo-600 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'}`} />
              ))}
            </div>
          </div>

          <button onClick={saveAccount} disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white
                       rounded-xl font-bold hover:opacity-90 transition shadow-md
                       flex items-center justify-center gap-2">
            {saving ? <><span className="animate-spin">⟳</span> Saving…</> : '✓ Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Staff Members ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Header row */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Staff Members</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="text-emerald-600 font-semibold">{activeCount} active</span>
              {inactiveCount > 0 && (
                <span className="text-gray-400 ml-2">· {inactiveCount} inactive</span>
              )}
              <span className="text-gray-400 ml-2">· {staffList.length} total</span>
            </p>
          </div>
          <button
            onClick={() => setFormModal('add')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl
                       text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
            <span className="text-lg leading-none">+</span> Add Staff
          </button>
        </div>

        {/* Legend row */}
        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-3">
          {[
            { icon: '✏️', label: 'Edit' },
            { icon: '⏸', label: 'Deactivate' },
            { icon: '▶', label: 'Activate' },
            { icon: '🗑️', label: 'Delete' },
          ].map(({ icon, label }) => (
            <span key={label} className="text-xs text-gray-500 flex items-center gap-1">
              <span>{icon}</span>{label}
            </span>
          ))}
        </div>

        {/* Staff list */}
        <div className="p-4 space-y-2">
          {staffList.length === 0 ? (
            <div className="py-10 text-center text-gray-400">
              <p className="text-4xl mb-2">👥</p>
              <p className="font-semibold text-sm">No staff yet</p>
              <button onClick={() => setFormModal('add')}
                className="mt-3 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-xl
                           text-xs font-bold hover:bg-indigo-200 transition">
                + Add First Member
              </button>
            </div>
          ) : (
            staffList.map(member => (
              <StaffRow
                key={member._id}
                member={member}
                onEdit={m => setFormModal(m)}
                onDelete={m => setConfirmModal({ type: 'delete', member: m })}
                onToggleActive={m => setConfirmModal({ type: 'toggle', member: m })}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {formModal && (
        <StaffFormModal
          member={formModal === 'add' ? null : formModal}
          existingEmails={existingEmails}
          onSave={handleSaveStaff}
          onClose={() => setFormModal(null)}
        />
      )}

      {/* ── Confirm: Delete ─────────────────────────────────────────────────── */}
      {confirmModal?.type === 'delete' && (
        <ConfirmModal
          title={`Remove ${confirmModal.member.name}?`}
          message="This will permanently remove the staff member. They will lose all access immediately. This cannot be undone."
          confirmLabel="Yes, Remove"
          confirmStyle="danger"
          onConfirm={() => handleDeleteConfirm(confirmModal.member)}
          onClose={() => setConfirmModal(null)}
        />
      )}

      {/* ── Confirm: Toggle Active ─────────────────────────────────────────── */}
      {confirmModal?.type === 'toggle' && (
        <ConfirmModal
          title={confirmModal.member.isActive === false
            ? `Reactivate ${confirmModal.member.name}?`
            : `Deactivate ${confirmModal.member.name}?`}
          message={confirmModal.member.isActive === false
            ? 'This member will regain access to the system and appear in login.'
            : 'This member will lose login access but their data will be preserved. You can reactivate them anytime.'}
          confirmLabel={confirmModal.member.isActive === false ? '✓ Activate' : '⏸ Deactivate'}
          confirmStyle={confirmModal.member.isActive === false ? 'success' : 'warn'}
          onConfirm={() => handleToggleActiveConfirm(confirmModal.member)}
          onClose={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
};