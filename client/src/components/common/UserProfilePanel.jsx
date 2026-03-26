import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { staff } from '../../data/data.js';

/**
 * Shared User Profile Panel — slide-in drawer with user details,
 * password change, shift info, and logout.
 * Works for any staff role (cook, waiter, owner).
 */
export const UserProfilePanel = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Find full staff record (has avatarColor, email, password)
  const staffRecord = staff.find(s => s._id === user?._id) || {};

  const [tab, setTab] = useState('profile'); // 'profile' | 'password' | 'shift'
  const [form, setForm] = useState({ name: staffRecord.name || user?.name || '', email: staffRecord.email || '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: '', ok: true });
  const [profileMsg, setProfileMsg] = useState('');

  const ROLE_BADGE = {
    cook: { color: 'bg-orange-100 text-orange-700', icon: '👨‍🍳' },
    waiter: { color: 'bg-blue-100 text-blue-700', icon: '🧑‍💼' },
    owner: { color: 'bg-purple-100 text-purple-700', icon: '👔' },
  };
  const badge = ROLE_BADGE[user?.role] || ROLE_BADGE.waiter;

  const shiftStart = new Date();
  shiftStart.setHours(9, 0, 0, 0);
  const now = new Date();
  const hoursWorked = Math.max(0, ((now - shiftStart) / 3600000)).toFixed(1);

  const saveProfile = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    // Apply to in-memory staff record
    if (staffRecord) { staffRecord.name = form.name.trim(); }
    setProfileMsg('Profile updated!');
    setSaving(false);
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const changePassword = async () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwMsg({ text: 'All fields are required', ok: false }); return;
    }
    if (pwForm.current !== staffRecord.password) {
      setPwMsg({ text: 'Current password is incorrect', ok: false }); return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ text: 'New password must be at least 6 characters', ok: false }); return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ text: 'New passwords do not match', ok: false }); return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    staffRecord.password = pwForm.next;
    setPwMsg({ text: '✓ Password changed successfully!', ok: true });
    setPwForm({ current: '', next: '', confirm: '' });
    setSaving(false);
    setTimeout(() => setPwMsg({ text: '', ok: true }), 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-6 text-white flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${staffRecord.avatarColor || 'bg-indigo-500'} flex items-center justify-center text-white font-extrabold text-xl shadow-lg`}>
                {(user?.name || '?')[0]}
              </div>
              <div>
                <p className="font-extrabold text-lg leading-tight">{user?.name}</p>
                <p className="text-gray-300 text-sm">{staffRecord.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>
              {badge.icon} {user?.role}
            </span>
            <span className="text-xs text-gray-400">ID: {user?._id?.slice(-6)}</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {[['profile', '👤', 'Profile'], ['password', '🔑', 'Password'], ['shift', '⏱️', 'Shift']].map(([_id, icon, label]) => (
            <button
              key={_id}
              onClick={() => setTab(_id)}
              className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-0.5 transition border-b-2 ${tab === _id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Profile Tab ── */}
          {tab === 'profile' && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Display Name</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Email</label>
                <input
                  type="email" value={form.email} disabled
                  className="w-full px-3 py-2.5 border border-gray-100 bg-gray-50 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Account Info</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Role</span>
                  <span className="font-semibold capitalize text-gray-900">{user?.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Staff ID</span>
                  <span className="font-mono text-gray-700">{user?._id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Restaurant</span>
                  <span className="font-semibold text-gray-900">{user?.restaurantId}</span>
                </div>
              </div>
              {profileMsg && (
                <div className="bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                  ✓ {profileMsg}
                </div>
              )}
              <button
                onClick={saveProfile} disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {saving ? <><span className="animate-spin">⟳</span> Saving…</> : 'Save Changes'}
              </button>
            </>
          )}

          {/* ── Password Tab ── */}
          {tab === 'password' && (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-medium">
                🔒 Choose a strong password (min. 6 characters)
              </div>
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'next', label: 'New Password' },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
                  <input
                    type="password"
                    value={pwForm[key]}
                    onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="••••••••"
                  />
                </div>
              ))}
              {pwMsg.text && (
                <div className={`text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2 ${pwMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {pwMsg.ok ? '✓' : '✕'} {pwMsg.text}
                </div>
              )}
              <button
                onClick={changePassword} disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {saving ? <><span className="animate-spin">⟳</span> Updating…</> : '🔑 Update Password'}
              </button>
            </>
          )}

          {/* ── Shift Tab ── */}
          {tab === 'shift' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Shift Start', value: '09:00 AM', icon: '🕘' },
                  { label: 'Hours Worked', value: `${hoursWorked}h`, icon: '⏱️' },
                  { label: 'Shift End', value: '06:00 PM', icon: '🕕' },
                  { label: 'Status', value: 'On Duty', icon: '✅' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl mb-1">{icon}</p>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-base font-extrabold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Today's Activity</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Orders handled</span><span className="font-bold">—</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Last action</span><span className="font-bold text-gray-700">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Break Timer</p>
                <p className="text-xs text-gray-500 mb-2">Track your breaks during the shift</p>
                <button className="w-full py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-200 transition">
                  ☕ Start Break
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer — Logout */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-2"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
};
