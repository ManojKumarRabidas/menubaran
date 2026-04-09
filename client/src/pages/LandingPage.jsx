import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📱',
      title: 'QR Code Ordering',
      desc: 'Customers scan, browse, and order directly from their phone — no app needed.',
    },
    {
      icon: '🍳',
      title: 'Live Kitchen Display',
      desc: 'Orders appear instantly on the kitchen screen. Zero paper tickets, zero delays.',
    },
    {
      icon: '🔔',
      title: 'Smart Waiter Alerts',
      desc: 'Water requests and waiter calls reach staff in real time via the floor display.',
    },
    {
      icon: '📊',
      title: 'Owner Analytics',
      desc: 'Track revenue, popular items, and table turnover from a single dashboard.',
    },
    {
      icon: '💳',
      title: 'Integrated Payments',
      desc: 'Accept cash, card, or UPI — generate bills and mark tables free in one tap.',
    },
    {
      icon: '⚡',
      title: 'Real-Time Sync',
      desc: 'Every order update — from kitchen to table — syncs instantly with WebSockets.',
    },
  ];

  const plans = [
    { name: 'Basic', price: '₹2,499', period: '/mo', tables: '10 tables', highlight: false },
    { name: 'Pro', price: '₹5,999', period: '/mo', tables: '30 tables', highlight: true },
    { name: 'Enterprise', price: '₹14,999', period: '/mo', tables: 'Unlimited', highlight: false },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm sm:text-base">🍽️</span>
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">MenuBaran</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/staff/login')}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-amber-600 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 sm:px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-100 rounded-full opacity-50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-orange-100 rounded-full opacity-40 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 sm:pt-20 pb-20 sm:pb-24 text-center">
          <span className="inline-block bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            🚀 Digital ordering platform for restaurants
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Your menu,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              beautifully digital.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            MenuBaran turns any restaurant into a smart, QR-driven dining experience —
            from order to kitchen to payment — all in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 text-base"
            >
              Start Free Trial
            </button>
            <button
              onClick={() => navigate('/guide')}
              className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-700 font-bold rounded-2xl transition-all duration-200 text-base flex items-center justify-center gap-2 group shadow-sm"
            >
              <span className="group-hover:rotate-12 transition-transform">📖</span>
              See How it Works
            </button>
            <button
              onClick={() => navigate('/menu/rest_1/table/table_1')}
              className="w-full sm:w-auto px-8 py-4 border-2 border-gray-100 hover:border-amber-400 text-gray-500 hover:text-amber-700 font-bold rounded-2xl transition-all duration-200 text-base"
            >
               View Demo Menu
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              One platform to manage your entire restaurant — from the customer table to the kitchen pass.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-amber-200 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-14">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set up your menu', desc: 'Add your restaurant, categories, and items from the owner dashboard in minutes.' },
              { step: '02', title: 'Print QR codes', desc: 'Each table gets a unique QR code linking to your digital menu — no app required.' },
              { step: '03', title: 'Watch orders flow', desc: 'Customers order → kitchen sees it instantly → waiter serves → payment done.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center shadow-lg mb-5">
                  {s.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <button
              onClick={() => navigate('/guide')}
              className="px-8 py-3 bg-white border-2 border-amber-200 text-amber-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-100/50"
            >
              Explore Full Step-by-Step Guide →
            </button>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-12">No hidden fees. Cancel anytime.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-2xl p-8 border-2 flex flex-col items-center transition-all duration-200 ${
                  p.highlight
                    ? 'border-amber-500 bg-amber-50 shadow-xl shadow-amber-100'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                {p.highlight && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">{p.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-gray-900">{p.price}</span>
                  <span className="text-gray-400 text-sm pb-1">{p.period}</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{p.tables}</p>
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition active:scale-95 ${
                    p.highlight
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="text-white font-bold">MenuBaran</span>
          </div>
          <p className="text-sm">© 2026 MenuBaran. All rights reserved.</p>
          <button
            onClick={() => navigate('/staff/login')}
            className="text-sm text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            Staff Login →
          </button>
        </div>
      </footer>
    </div>
  );
}
