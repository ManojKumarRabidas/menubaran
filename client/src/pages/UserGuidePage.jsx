import { useNavigate } from 'react-router-dom';

/**
 * Full Step-by-Step User Guide
 * Following 15 exact steps + Advantages
 */
export default function UserGuidePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white text-xl">🍽️</span>
            </div>
            <span className="font-black text-2xl tracking-tight uppercase">MenuBaran <span className="text-indigo-600">Masterclass</span></span>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="hidden sm:block px-8 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
          >
            Start Your Journey
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-8 inline-block shadow-sm">
          The 15-Step Blueprint
        </span>
        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
          Every Step to a <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 italic">Smart Restaurant</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Whether you're a small cafe or a grand dining hall, see how MenuBaran 
          runs every second of your operation with surgical precision.
        </p>
      </header>

      {/* ── Timeline Start ── */}
      <main className="max-w-5xl mx-auto px-6 relative">
        {/* Central Line */}
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-1 bg-gradient-to-b from-indigo-100 via-indigo-200 to-indigo-50 -translate-x-1/2 -z-10 rounded-full"></div>

        {/* ── STEPS ── */}
        <div className="space-y-32 py-20">
          
          <Step 
            number="01" 
            title="Registration" 
            desc="The journey begins here. Upload your restaurant details, owner credentials, and verification documents. We ensure every restaurant on our platform is genuine."
            mockup={<MockRegistration />}
            side="left"
          />

          <Step 
            number="02" 
            title="Admin Approval" 
            label="Security First"
            desc="Our system administrators review your documents. This manual verification step ensures that only licensed, authentic restaurants are part of the MenuBaran network."
            mockup={<MockApproval />}
            side="right"
          />

          <Step 
            number="03" 
            title="Staff Management" 
            desc="Once approved, log in and add your team. Create dedicated accounts for Cooks and Waiters. Each staff member gets their own workspace tailored to their role."
            mockup={<MockStaff />}
            side="left"
          />

          <Step 
            number="04" 
            title="Table Management" 
            desc="Digitize your floor plan in seconds. Add tables, assign names (e.g., Terrace 1, Window 2), and organize them logically to match your real-world layout."
            mockup={<MockTables />}
            side="right"
          />

          <Step 
            number="05" 
            title="Menu Architecture" 
            desc="Build your digital menu. Create categories, add beautiful dish names, set prices, and attach emojis. Your menu is now alive and instantly updatable."
            mockup={<MockMenu />}
            side="left"
          />

          <Step 
            number="06" 
            title="QR Code Printing" 
            desc="The system generates unique QR codes for every table. Print them out and place them on your tables. Your digital gateway is now open for business."
            mockup={<MockQR />}
            side="right"
          />

          <Step 
            number="07" 
            title="Customer Ordering" 
            desc="Customer scans code → browses your vibrant menu → selects items → places order. No app required. No waiting for a waiter to take notes."
            mockup={<MockCustomerMenu />}
            side="left"
          />

          <Step 
            number="08" 
            title="Kitchen Notification" 
            desc="BEEP! The kitchen gets an instant notification. The new order appears on the Kitchen Display System (KDS) with table numbers and item specifics."
            mockup={<MockKDSNotify />}
            side="right"
          />

          <Step 
            number="09" 
            title="Chef Flow" 
            desc="Chefs manage the lifecycle. One tap moves a dish from 'Pending' to 'Cooking' and finally to 'Ready'. Full transparency on what's burning and what's served."
            mockup={<MockKDSLifecycle />}
            side="left"
          />

          <Step 
            number="10" 
            title="Waiter Notification" 
            desc="The moment the chef marks an order as 'Ready', the Waiter Floor Display alerts staff with a ping. Food reaches the table at peak temperature."
            mockup={<MockWaiterAlert />}
            side="right"
          />

          <Step 
            number="11" 
            title="Direct Requests" 
            desc="Customers can tap 'Request Water', 'Request Waiter', or 'Request Bill' from their phone. These alerts reach staff instantly on the floor display."
            mockup={<MockRequests />}
            side="left"
          />

          <Step 
            number="12" 
            title="Live Synchronization" 
            desc="Status updates sync everywhere. The customer sees 'Ready' on their phone, the waiter sees the notification, and the owner sees it in their dashboard."
            mockup={<MockSync />}
            side="right"
          />

          <Step 
            number="13" 
            title="Owner Dashboard" 
            desc="Monitor the heartbeat of your restaurant. See every live order, table status, and pending request from a professional, bird's-eye view."
            mockup={<MockOwnerLive />}
            side="left"
          />

          <Step 
            number="14" 
            title="Final Payment" 
            desc="Process bills with one tap. Accept Cash, Card, or UPI. Once paid, the table status resets automatically, making it ready for the next guest."
            mockup={<MockPayment />}
            side="right"
          />

          <Step 
            number="15" 
            title="Data Intelligence" 
            desc="Review your day. See total revenue, peak hours, and staff performance. Every order generates data you can use to grow your profits."
            mockup={<MockAnalytics />}
            side="left"
          />

        </div>
      </main>

      {/* ── Advantages Section ── */}
      <section className="bg-slate-900 py-32 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">The MenuBaran Edge</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">Why Modern Restaurants <br/><span className="text-indigo-500 italic">Must</span> Switch</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Advantage 
               icon="🎯" 
               title="Zero Missed Orders" 
               desc="Paper tickets get lost. Digital queues don't. Every request is tracked until fulfilled." 
            />
            <Advantage 
               icon="💸" 
               title="Lower Labor Cost" 
               desc="Waiters focus 100% on service and hospitality, not writing down orders or running back to the kitchen." 
            />
            <Advantage 
               icon="⚡" 
               title="Faster Table Turnover" 
               desc="Streamlined ordering and one-tap billing can help you serve 25% more tables during peak hours." 
            />
            <Advantage 
               icon="📈" 
               title="Total Observability" 
               desc="Know exactly what's happening at every table, even if you are not physically at the restaurant." 
            />
          </div>

          <div className="mt-24 p-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] text-center shadow-3xl shadow-indigo-500/20">
            <h3 className="text-3xl font-black mb-6">Stop managing chaos. Start managing a platform.</h3>
            <p className="text-indigo-100 max-w-xl mx-auto mb-10 font-medium">Join the digital revolution and give your restaurant the professional edge it deserves.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="px-10 py-4 bg-white text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Get Started Today</button>
              <button onClick={() => navigate('/')} className="px-10 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 transition-all">Main Website</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center">
        <div className="flex justify-center gap-2 mb-4">
           {['🏠', '📜', '⚖️', '📞'].map((e,i) => <span key={i} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg">{e}</span>)}
        </div>
        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">© 2026 MenuBaran Software Solutions</p>
      </footer>
    </div>
  );
}

// ── Components ──

function Step({ number, title, label, desc, mockup, side }) {
  const isLeft = side === 'left';
  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 sm:gap-20 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
           <span className="text-4xl font-black text-slate-100 italic transition-colors group-hover:text-indigo-100">{number}</span>
           {label && <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-3 py-1 rounded-full">{label}</span>}
        </div>
        <h3 className="text-3xl font-black uppercase text-slate-800 tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium text-lg">{desc}</p>
      </div>
      <div className="flex-1 w-full max-w-md">
         <div className="bg-white rounded-[2.5rem] p-4 shadow-3xl border border-slate-50 ring-12 ring-slate-50/50 hover:ring-indigo-50/50 transition-all duration-500 group">
            {mockup}
         </div>
      </div>
    </div>
  );
}

function Advantage({ icon, title, desc }) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-all group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-xl font-bold mb-2 uppercase tracking-tight">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ── Mockups ──

const MockRegistration = () => (
   <div className="space-y-4 p-4 grayscale group-hover:grayscale-0 transition-all">
      <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
      <div className="grid grid-cols-2 gap-2">
         <div className="h-8 bg-slate-50 border rounded-lg"></div>
         <div className="h-8 bg-slate-50 border rounded-lg"></div>
      </div>
      <div className="h-8 bg-slate-50 border rounded-lg"></div>
      <div className="h-24 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-xl flex flex-col items-center justify-center gap-2">
         <span className="text-2xl">📄</span>
         <span className="text-[10px] font-black uppercase text-indigo-400">Upload Documents</span>
      </div>
      <div className="h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100"></div>
   </div>
);

const MockApproval = () => (
  <div className="flex flex-col items-center justify-center p-8 gap-6 group-hover:text-emerald-600 transition-all">
     <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
     </div>
     <div className="text-center space-y-2">
        <div className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-emerald-400">Verifying Identity</div>
        <p className="text-[10px] font-bold text-slate-400">Our team is reviewing your restaurant license...</p>
     </div>
  </div>
);

const MockStaff = () => (
  <div className="space-y-3 p-4">
     {[
       { role: 'Cook', icon: '👨‍🍳', color: 'orange' },
       { role: 'Waiter', icon: '🧑‍💼', color: 'blue' }
     ].map(s => (
       <div key={s.role} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-indigo-100 transition-all">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-full bg-${s.color}-100 flex items-center justify-center shadow-sm`}>{s.icon}</div>
             <div>
                <div className="text-xs font-black uppercase">{s.role} Account</div>
                <div className="text-[8px] font-bold text-slate-400">rest_staff_001</div>
             </div>
          </div>
          <div className="w-8 h-4 bg-emerald-400 rounded-full"></div>
       </div>
     ))}
     <div className="py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest">+ Add Member</div>
  </div>
);

const MockTables = () => (
  <div className="grid grid-cols-3 gap-3 p-4">
     {[...Array(6)].map((_,i) => (
       <div key={i} className="aspect-square bg-slate-50 rounded-2xl border flex flex-col items-center justify-center gap-1 group-hover:border-indigo-400 group-hover:bg-indigo-50 transition-all">
          <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-indigo-600">Table</span>
          <span className="text-lg font-black text-slate-900 group-hover:text-indigo-700">{i+1}</span>
       </div>
     ))}
  </div>
);

const MockMenu = () => (
  <div className="space-y-3 p-4">
     <div className="flex gap-2 mb-2">
        <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase">Main Course</div>
        <div className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[8px] font-black uppercase">Drinks</div>
     </div>
     <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
           <span className="text-xl">🍕</span>
           <span className="text-xs font-black">Spicy Paneer Pizza</span>
        </div>
        <span className="text-xs font-black text-indigo-600">₹349</span>
     </div>
     <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between opacity-50">
        <div className="flex items-center gap-2">
           <span className="text-xl">🍟</span>
           <span className="text-xs font-black">French Fries</span>
        </div>
        <span className="text-xs font-black text-indigo-600">₹120</span>
     </div>
  </div>
);

const MockQR = () => (
  <div className="flex flex-col items-center justify-center p-6 gap-4">
     <div className="w-32 h-32 p-3 bg-white border-4 border-slate-900 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden group-hover:border-indigo-600 transition-all">
        <div className="grid grid-cols-4 gap-1 opacity-50">
           {[...Array(16)].map((_,i) => <div key={i} className={`w-4 h-4 rounded-sm ${i % 3 === 0 ? 'bg-slate-900' : 'bg-transparent'}`}></div>)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">🍽️</div>
     </div>
     <div className="text-center">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-900">Table 01</div>
        <div className="text-[8px] font-bold text-slate-400">Scan for Digital Menu</div>
     </div>
  </div>
);

const MockCustomerMenu = () => (
  <div className="bg-slate-50 rounded-3xl p-4 space-y-4 border border-slate-100">
     <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
     <div className="h-32 bg-amber-100 rounded-2xl flex items-center justify-center text-5xl">🌮</div>
     <div className="flex justify-between items-center">
        <div>
           <div className="text-sm font-black">Cheesy Tacos</div>
           <div className="text-[10px] font-bold text-indigo-600">₹199</div>
        </div>
        <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-100">+ Add</div>
     </div>
  </div>
);

const MockKDSNotify = () => (
  <div className="p-4 space-y-3">
     <div className="bg-slate-900 text-white p-3 rounded-2xl border-l-4 border-amber-500 shadow-xl relative animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex justify-between items-center mb-1">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">New Order</span>
           <span className="text-[10px] font-black text-amber-500">NOW</span>
        </div>
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-black">T5</div>
           <div className="text-xs font-bold">2 Items Received</div>
        </div>
     </div>
     <div className="opacity-30 bg-slate-900 text-white p-3 rounded-2xl border-l-4 border-slate-700">
        <div className="text-xs font-bold">Table 1 Order...</div>
     </div>
  </div>
);

const MockKDSLifecycle = () => (
  <div className="p-4 space-y-3">
     <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
           <div className="text-[8px] font-black text-indigo-400 uppercase mb-1">Pending</div>
           <div className="text-[10px] font-bold">Pepperoni Pizza</div>
        </div>
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-amber-500/10 active:w-full transition-all"></div>
           <div className="text-[8px] font-black text-amber-600 uppercase mb-1">Cooking</div>
           <div className="text-[10px] font-bold">Chicken Burger</div>
        </div>
     </div>
     <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between">
        <div className="text-[10px] font-black text-emerald-700 uppercase">Order Ready!</div>
        <div className="text-[10px] font-black text-emerald-600">✓ Serve</div>
     </div>
  </div>
);

const MockWaiterAlert = () => (
   <div className="flex flex-col items-center justify-center p-8 gap-4 bg-emerald-500/5 rounded-3xl animate-pulse">
      <div className="text-5xl">🔔</div>
      <div className="text-center">
         <div className="text-lg font-black text-emerald-700 uppercase tracking-tighter leading-none">Food Ready!</div>
         <div className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-widest">Table 05 • Counter 1</div>
      </div>
      <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">On My Way</button>
   </div>
);

const MockRequests = () => (
  <div className="p-4 space-y-2">
     {[
       { icon: '💧', label: 'Water Request', table: '08', color: 'blue' },
       { icon: '🧑‍💼', label: 'Waiter Call', table: '03', color: 'indigo' },
       { icon: '🧾', label: 'Bill Request', table: '01', color: 'red' }
     ].map(r => (
       <div key={r.label} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
             <span className="text-xl">{r.icon}</span>
             <span className="text-[10px] font-black uppercase tracking-tight">{r.label}</span>
          </div>
          <span className={`px-2 py-1 bg-${r.color}-100 text-${r.color}-700 rounded-lg text-[10px] font-black ring-1 ring-${r.color}-200`}>T{r.table}</span>
       </div>
     ))}
  </div>
);

const MockSync = () => (
  <div className="relative p-8 flex items-center justify-center">
     <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-indigo-100 animate-ping"></div>
        <div className="absolute w-48 h-48 rounded-full border border-indigo-50 animate-ping duration-1000"></div>
     </div>
     <div className="grid grid-cols-2 gap-8 relative z-10">
        <div className="bg-white p-3 rounded-xl shadow-lg border border-indigo-50 text-center">
           <div className="text-xl mb-1">📱</div>
           <div className="text-[8px] font-black text-slate-500">Customer</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-lg border border-indigo-50 text-center">
           <div className="text-xl mb-1">👨‍🍳</div>
           <div className="text-[8px] font-black text-slate-500">Kitchen</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-lg border border-indigo-50 text-center">
           <div className="text-xl mb-1">🧑‍💼</div>
           <div className="text-[8px] font-black text-slate-500">Waiter</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-lg border border-indigo-50 text-center">
           <div className="text-xl mb-1">👑</div>
           <div className="text-[8px] font-black text-slate-500">Owner</div>
        </div>
     </div>
     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[8px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Live Sync</span>
     </div>
  </div>
);

const MockOwnerLive = () => (
  <div className="p-4 space-y-4">
     <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
        Live Observability
     </div>
     <div className="space-y-2">
        {[
          { t: 'T1', s: 'Bill Req', c: 'red' },
          { t: 'T3', s: 'Dining', c: 'indigo' },
          { t: 'T5', s: 'Cooking' , c: 'amber'}
        ].map(row => (
          <div key={row.t} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
             <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center font-black text-xs">{row.t}</div>
             <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full bg-${row.c}-500 w-3/4`}></div>
             </div>
             <span className={`text-[8px] font-black text-${row.c}-600 uppercase`}>{row.s}</span>
          </div>
        ))}
     </div>
  </div>
);

const MockPayment = () => (
  <div className="p-4 space-y-4 text-center">
      <div className="py-6 border-2 border-indigo-50 bg-indigo-50/30 rounded-3xl">
         <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Amount Due</div>
         <div className="text-4xl font-black text-indigo-900 leading-none">₹850.00</div>
         <div className="text-[10px] font-black text-indigo-400 mt-2 uppercase tracking-tight">Table 01 • Order #8C2A</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
         {['💵','💳','📱'].map(e => <div key={e} className="p-3 bg-white border rounded-xl text-xl shadow-sm">{e}</div>)}
      </div>
      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100">Confirm Payment</button>
  </div>
);

const MockAnalytics = () => (
  <div className="p-4 space-y-6">
     <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
           <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="60" fill="transparent" className="text-indigo-600" />
           </svg>
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 leading-none">₹38k</span>
              <span className="text-[6px] font-black text-slate-400 uppercase">Growth</span>
           </div>
        </div>
     </div>
     <div className="grid grid-cols-2 gap-2">
        <div className="p-2 border rounded-xl text-center">
           <div className="text-[10px] font-black text-slate-900 leading-none mb-1">124</div>
           <div className="text-[6px] font-black text-slate-400 uppercase">Orders</div>
        </div>
        <div className="p-2 border rounded-xl text-center">
           <div className="text-[10px] font-black text-slate-900 leading-none mb-1">₹420</div>
           <div className="text-[6px] font-black text-slate-400 uppercase">Avg Bill</div>
        </div>
     </div>
  </div>
);
