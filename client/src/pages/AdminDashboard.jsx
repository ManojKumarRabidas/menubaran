import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API = '/api';
const UPL = 'http://localhost:5000';


const NAV = [
  { key: 'overview', icon: '📊', label: 'Overview' },
  { key: 'pending', icon: '🕐', label: 'New Registrations' },
  { key: 'approved', icon: '✅', label: 'Approved Restaurants' },
  { key: 'rejected', icon: '❌', label: 'Rejected' },
  { key: 'feedback', icon: '⭐', label: 'Platform Reviews' },
  { key: 'complaints', icon: '📢', label: 'Platform Complaints' },
];

const CATEGORY_COLORS = {
  'UX/Interface':     'bg-blue-100 text-blue-700',
  'Performance':      'bg-purple-100 text-purple-700',
  'Feature Request':  'bg-teal-100 text-teal-700',
  'Billing':          'bg-orange-100 text-orange-700',
  'Support':          'bg-green-100 text-green-700',
  'General':          'bg-gray-100 text-gray-600',
  'Technical':        'bg-red-100 text-red-700',
  'Feature':          'bg-teal-100 text-teal-700',
  'Account':          'bg-indigo-100 text-indigo-700',
  'Other':            'bg-gray-100 text-gray-600',
};

function Badge({ s }) {
  const m = {
    pending:       'bg-amber-100 text-amber-800',
    approved:      'bg-green-100 text-green-800',
    rejected:      'bg-red-100 text-red-800',
    open:          'bg-red-100 text-red-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    resolved:      'bg-green-100 text-green-700',
  };
  const labels = { 'in-progress': 'In Progress' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${m[s] || 'bg-gray-100 text-gray-700'}`}>{labels[s] || s}</span>;
}

function Toast({ t }) {
  if (!t) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2 ${t.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {t.type === 'error' ? '⚠️' : '✅'} {t.msg}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${color} flex items-center gap-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-black text-gray-900">{value ?? '—'}</p>
      </div>
    </div>
  );
}

function RestaurantRow({ r, onView, onApprove, onReject, onToggleLogin, toggling }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {r.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <span className="font-bold text-gray-900">{r.name}</span>
          <Badge s={r.status} />
          {r.ownerActive !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.ownerActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
              {r.ownerActive ? '🔓 Login On' : '🔒 Login Off'}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
          {r.ownerName && <span>👤 {r.ownerName}</span>}
          {r.ownerEmail && <span>✉️ {r.ownerEmail}</span>}
          {r.cuisineType?.length > 0 && <span>🍽️ {r.cuisineType.join(', ')}</span>}
          <span>📅 {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {onView && <button onClick={onView} className="px-3 py-1.5 bg-gray-100 hover:bg-amber-50 hover:text-amber-700 text-gray-700 text-xs font-semibold rounded-lg transition">👁 View</button>}
        {r.status === 'pending' && onApprove && (
          <>
            <button onClick={onReject} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition">✕ Reject</button>
            <button onClick={onApprove} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition">✓ Approve</button>
          </>
        )}
        {onToggleLogin && (
          <button
            onClick={onToggleLogin}
            disabled={toggling}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition disabled:opacity-50 ${r.ownerActive ? 'bg-red-50 hover:bg-red-100 text-red-700' : 'bg-blue-50 hover:bg-blue-100 text-blue-700'}`}
          >
            {toggling ? '…' : r.ownerActive ? '🔒 Disable Login' : '🔓 Enable Login'}
          </button>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value, mono = false }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-gray-800 break-all ${mono ? 'font-mono tracking-wide' : ''}`}>{value}</p>
    </div>
  );
}

function DocBtn({ href, label }) {
  if (!href) return null;
  return (
    <a href={`${UPL}${href}`} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition">
      {label}
    </a>
  );
}

function DetailModal({ r, onClose, onApprove, onReject }) {
  if (!r) return null;
  const addr = r.addressDetails || {};
  const hasAddress = addr.street || addr.locality || addr.cityPincode || addr.mapPin;
  const hasLegal = r.gstin || r.fssaiLicense || r.businessPan;
  const hasDocs = r.registrationDocument || r.fssaiCertificate || r.panCard || r.bankPassbook || r.shopPhoto || r.restaurantLogo || r.menuImages?.length;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-white">{r.name}</h2>
              <Badge s={r.status} />
            </div>
            <p className="text-xs text-gray-400">Registered on {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none ml-4">×</button>
        </div>

        <div className="p-6 space-y-5 text-sm">
          {/* Basic Info */}
          <section>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">👤 Owner / Manager</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <InfoBlock label="Name" value={r.ownerName} />
              <InfoBlock label="Email" value={r.ownerEmail} />
              <InfoBlock label="Mobile" value={r.ownerMobile} />
            </div>
          </section>

          {/* Cuisine */}
          {r.cuisineType?.length > 0 && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">🍽️ Cuisine Types</p>
              <div className="flex flex-wrap gap-2">
                {r.cuisineType.map(c => (
                  <span key={c} className="px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">{c}</span>
                ))}
              </div>
            </section>
          )}

          {/* Legal */}
          {hasLegal && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">🏛️ Legal Identifiers</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InfoBlock label="GSTIN" value={r.gstin} mono />
                <InfoBlock label="FSSAI License" value={r.fssaiLicense} mono />
                <InfoBlock label="Business PAN" value={r.businessPan} mono />
              </div>
            </section>
          )}

          {/* Address */}
          {hasAddress && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">📍 Physical Address</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoBlock label="Street" value={addr.street} />
                <InfoBlock label="Locality / Area" value={addr.locality} />
                <InfoBlock label="City & Pincode" value={addr.cityPincode} />
                {addr.mapPin && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">🗺️ Map Pin</p>
                    <a href={addr.mapPin} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline break-all text-xs">{addr.mapPin}</a>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Documents */}
          {hasDocs && (
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">📎 Uploaded Documents</p>
              <div className="flex flex-wrap gap-2">
                <DocBtn href={r.registrationDocument} label="📄 Registration Doc" />
                <DocBtn href={r.fssaiCertificate} label="🥗 FSSAI Certificate" />
                <DocBtn href={r.panCard} label="💳 PAN Card" />
                <DocBtn href={r.bankPassbook} label="🏦 Bank Passbook" />
                <DocBtn href={r.shopPhoto} label="📸 Shop Photo" />
                <DocBtn href={r.restaurantLogo} label="🖼️ Restaurant Logo" />
                {r.menuImages?.map((img, i) => <DocBtn key={i} href={img} label={`📋 Menu ${i + 1}`} />)}
              </div>
            </section>
          )}

          {/* No optional data notice */}
          {!hasLegal && !hasAddress && !hasDocs && !r.cuisineType?.length && (
            <p className="text-xs text-gray-400 italic">No additional details were provided during registration.</p>
          )}

          {/* Actions */}
          {r.status === 'pending' && (
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button onClick={() => onReject(r._id)} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition">✕ Reject</button>
              <button onClick={() => onApprove(r._id)} className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition">✓ Approve & Activate</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState('overview');
  const [data, setData] = useState({ pending: [], approved: [], rejected: [] });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ total: 0, avgRating: 0, positivePercent: 0 });
  const [complaints, setComplaints] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, pRes, aRes, rRes] = await Promise.all([
        fetch(`${API}/admin/stats`),
        fetch(`${API}/admin/restaurants?status=pending`),
        fetch(`${API}/admin/restaurants?status=approved`),
        fetch(`${API}/admin/restaurants?status=rejected`),
      ]);
      const [s, p, a, r] = await Promise.all([sRes.json(), pRes.json(), aRes.json(), rRes.json()]);
      if (s.success) setStats(s.data);
      const enriched = a.success ? a.data : [];
      setData({ pending: p.success ? p.data : [], approved: enriched, rejected: r.success ? r.data : [] });
    } catch { showToast('Failed to load data', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API}/admin/restaurants/${id}/${action}`, { method: 'PATCH' });
      const d = await res.json();
      if (d.success) {
        await fetchAll();
        setSelected(null);
        showToast(`Restaurant ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
      } else showToast(d.error || 'Action failed', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const handleToggleLogin = async (r) => {
    setToggling(r._id);
    try {
      const res = await fetch(`${API}/admin/restaurants/${r._id}/toggle-login`, { method: 'PATCH' });
      const d = await res.json();
      if (d.success) {
        setData(prev => ({ ...prev, approved: prev.approved.map(x => x._id === r._id ? { ...x, ownerActive: d.isActive } : x) }));
        showToast(d.message);
      } else showToast(d.error || 'Failed', 'error');
    } catch { showToast('Network error', 'error'); }
    finally { setToggling(null); }
  };

  const resolveComplaint = async (id) => {
    try {
      const res = await fetch(`${API}/admin/complaints/${id}/resolve`, { method: 'PATCH' });
      const d = await res.json();
      if (d.success) {
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: 'resolved', resolvedAt: d.data.resolvedAt } : c));
        showToast('Complaint marked as resolved.');
      } else showToast('Failed to resolve', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const markInProgress = async (id) => {
    try {
      const res = await fetch(`${API}/admin/complaints/${id}/progress`, { method: 'PATCH' });
      const d = await res.json();
      if (d.success) {
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: 'in-progress' } : c));
        showToast('Complaint marked as In Progress.');
      } else showToast('Failed to update', 'error');
    } catch { showToast('Network error', 'error'); }
  };

  const fetchFeedback = useCallback(async () => {
    setFeedbackLoading(true);
    try {
      const res = await fetch(`${API}/admin/feedback`);
      const d = await res.json();
      if (d.success) { setFeedback(d.data); setFeedbackStats(d.stats); }
    } catch { showToast('Failed to load feedback', 'error'); }
    finally { setFeedbackLoading(false); }
  }, []);

  const fetchComplaints = useCallback(async () => {
    setComplaintsLoading(true);
    try {
      const res = await fetch(`${API}/admin/complaints`);
      const d = await res.json();
      if (d.success) setComplaints(d.data);
    } catch { showToast('Failed to load complaints', 'error'); }
    finally { setComplaintsLoading(false); }
  }, []);

  // Lazy-load feedback/complaints when those tabs are first opened
  useEffect(() => {
    if (section === 'feedback' && feedback.length === 0 && !feedbackLoading) fetchFeedback();
    if (section === 'complaints' && complaints.length === 0 && !complaintsLoading) fetchComplaints();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const filtered = (list) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(r => r.name?.toLowerCase().includes(q) || r.ownerName?.toLowerCase().includes(q) || r.ownerEmail?.toLowerCase().includes(q));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white flex-shrink-0 transition-all duration-300 flex flex-col sticky top-0 h-screen`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          <span className="text-2xl">🍽️</span>
          {sidebarOpen && <span className="font-bold text-sm leading-tight">MenuBaran<br /><span className="text-gray-400 font-normal text-xs">Admin Console</span></span>}
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV.map(n => (
            <button key={n.key} onClick={() => { setSection(n.key); setSearch(''); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${section === n.key ? 'bg-amber-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              title={!sidebarOpen ? n.label : ''}>
              <span className="text-base flex-shrink-0">{n.icon}</span>
              {sidebarOpen && <span className="truncate">{n.label}</span>}
              {sidebarOpen && n.key === 'pending' && data.pending.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{data.pending.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-2 pb-4 space-y-1">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl text-sm transition">
            {sidebarOpen ? '◀' : '▶'}
          </button>
          <button onClick={() => navigate('/admin/login')} className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl text-sm transition">
            <span>🚪</span>{sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{NAV.find(n => n.key === section)?.icon} {NAV.find(n => n.key === section)?.label}</h1>
            <p className="text-xs text-gray-400">MenuBaran Platform Management</p>
          </div>
          <div className="text-sm text-gray-500">🕒 {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </header>

        <div className="p-6 max-w-6xl mx-auto">

          {/* ── OVERVIEW ── */}
          {section === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="🕐" label="Pending Review" value={stats?.pending} color="border-amber-400" />
                <StatCard icon="✅" label="Active Restaurants" value={stats?.approved} color="border-green-400" />
                <StatCard icon="❌" label="Rejected" value={stats?.rejected} color="border-red-400" />
                <StatCard icon="📦" label="Total Orders" value={stats?.totalOrders} color="border-blue-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3">📅 New This Month</h3>
                  <p className="text-4xl font-black text-amber-600">{stats?.newThisMonth ?? '—'}</p>
                  <p className="text-xs text-gray-400 mt-1">Restaurant registrations since 1st</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-3">⚡ Quick Actions</h3>
                  <div className="space-y-2">
                    {[['🕐 Review Pending', 'pending'], ['✅ Manage Approved', 'approved'], ['📢 View Complaints', 'complaints']].map(([l, k]) => (
                      <button key={k} onClick={() => setSection(k)} className="w-full text-left px-4 py-2.5 bg-gray-50 hover:bg-amber-50 hover:text-amber-700 rounded-xl text-sm font-semibold transition">{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">🍽️ Recent Registrations</h3>
                <div className="space-y-2">
                  {[...data.pending, ...data.approved].slice(0, 5).map(r => (
                    <div key={r._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">{r.name?.charAt(0)}</div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">{r.name}</p><p className="text-xs text-gray-400">{r.ownerEmail}</p></div>
                      <Badge s={r.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PENDING / REJECTED shared list ── */}
          {(section === 'pending' || section === 'rejected') && (
            <div className="space-y-4">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurants…" className="w-full max-w-sm px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm" />
              {loading ? <div className="text-center py-20 text-gray-400">Loading…</div> : filtered(data[section]).length === 0 ? (
                <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-4">📭</div><p>No {section} restaurants.</p></div>
              ) : filtered(data[section]).map(r => (
                <RestaurantRow key={r._id} r={r} onView={() => setSelected(r)}
                  onApprove={section === 'pending' ? () => handleAction(r._id, 'approve') : null}
                  onReject={section === 'pending' ? () => handleAction(r._id, 'reject') : null} />
              ))}
            </div>
          )}

          {/* ── APPROVED ── */}
          {section === 'approved' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search approved restaurants…" className="flex-1 max-w-sm px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-sm" />
                <span className="text-sm text-gray-500 font-medium">{data.approved.length} restaurant{data.approved.length !== 1 ? 's' : ''}</span>
              </div>
              {loading ? <div className="text-center py-20 text-gray-400">Loading…</div> : filtered(data.approved).length === 0 ? (
                <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-4">📭</div><p>No approved restaurants.</p></div>
              ) : filtered(data.approved).map(r => (
                <RestaurantRow key={r._id} r={r} onView={() => setSelected(r)}
                  onToggleLogin={() => handleToggleLogin(r)}
                  toggling={toggling === r._id} />
              ))}
            </div>
          )}

          {/* ── FEEDBACK (from restaurants about the platform) ── */}
          {section === 'feedback' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                💡 These reviews are submitted by <strong>restaurant owners (clients)</strong> about their experience using the <strong>MenuBaran platform</strong>.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[['⭐ Avg Rating', feedbackStats.avgRating ? `${feedbackStats.avgRating} / 5` : '—'], ['📝 Total Reviews', feedbackStats.total || 0], ['😊 Positive', feedbackStats.total ? `${feedbackStats.positivePercent}%` : '—']].map(([l, v]) => (
                  <div key={l} className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-xs text-gray-400 mb-1">{l}</p>
                    <p className="text-2xl font-black text-gray-900">{v}</p>
                  </div>
                ))}
              </div>
              {feedbackLoading ? (
                <div className="text-center py-12 text-gray-400">Loading feedback…</div>
              ) : feedback.length === 0 ? (
                <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-2">📭</div><p>No platform feedback yet.</p></div>
              ) : feedback.map(f => (
                <div key={f._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900">{f.restaurantName}</p>
                        {f.category && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[f.category] || 'bg-gray-100 text-gray-600'}`}>{f.category}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        👤 {f.ownerName} &nbsp;·&nbsp; 📅 {new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="flex gap-0.5 text-base">{'⭐'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</div>
                      <span className="text-xs text-gray-400 font-semibold">{f.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{f.comment}"</p>
                </div>
              ))}
            </div>
          )}

          {/* ── COMPLAINTS (from restaurants about the platform) ── */}
          {section === 'complaints' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                💡 These complaints are submitted by <strong>restaurant owners (clients)</strong> about issues they face using the <strong>MenuBaran platform</strong>.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ['🔴 Open', complaints.filter(c => c.status === 'open').length],
                  ['🔵 In Progress', complaints.filter(c => c.status === 'in-progress').length],
                  ['✅ Resolved', complaints.filter(c => c.status === 'resolved').length],
                ].map(([l, v]) => (
                  <div key={l} className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <p className="text-xs text-gray-400 mb-1">{l}</p>
                    <p className="text-2xl font-black text-gray-900">{v}</p>
                  </div>
                ))}
              </div>
              {complaintsLoading ? (
                <div className="text-center py-12 text-gray-400">Loading complaints…</div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-2">📭</div><p>No platform complaints yet.</p></div>
              ) : complaints.map(c => (
                <div key={c._id} className={`bg-white rounded-xl border shadow-sm p-4 ${
                  c.status === 'open' ? 'border-red-100' : c.status === 'in-progress' ? 'border-blue-100' : 'border-gray-100'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">{c.restaurantName}</p>
                        <Badge s={c.status} />
                        {c.category && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[c.category] || 'bg-gray-100 text-gray-600'}`}>{c.category}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{c.issue}</p>
                      <p className="text-xs text-gray-400 mt-1.5">
                        👤 {c.ownerName} &nbsp;·&nbsp; 📅 {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {c.status === 'resolved' && c.resolvedAt && (
                          <> &nbsp;·&nbsp; ✅ Resolved {new Date(c.resolvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                        )}
                      </p>
                      {c.adminNote && (
                        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
                          <span className="font-semibold">Admin Note:</span> {c.adminNote}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {c.status === 'open' && (
                        <button onClick={() => markInProgress(c._id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition whitespace-nowrap">
                          🔵 In Progress
                        </button>
                      )}
                      {(c.status === 'open' || c.status === 'in-progress') && (
                        <button onClick={() => resolveComplaint(c._id)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition whitespace-nowrap">
                          ✓ Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selected && <DetailModal r={selected} onClose={() => setSelected(null)} onApprove={id => handleAction(id, 'approve')} onReject={id => handleAction(id, 'reject')} />}
      <Toast t={toast} />
    </div>
  );
}