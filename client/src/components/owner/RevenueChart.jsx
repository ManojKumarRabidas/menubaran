/**
 * Weekly Revenue Bar Chart – pure CSS bars with animated fills
 */
export const RevenueChart = ({ data = [] }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  const colors = [
    'from-violet-500 to-purple-600',
    'from-indigo-500 to-blue-500',
    'from-blue-500 to-cyan-400',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Weekly Revenue</h3>
          <p className="text-sm text-gray-500 mt-0.5">Last 7 days performance</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
          <span className="text-xs font-semibold text-indigo-700">Revenue</span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-48">
        {data.map((item, idx) => {
          const heightPct = (item.revenue / maxRevenue) * 100;
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap pointer-events-none mb-1">
                ${item.revenue} • {item.orders} orders
              </div>
              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                <div
                  className={`w-full rounded-t-xl bg-gradient-to-t ${colors[idx % colors.length]} transition-all duration-700 cursor-pointer hover:opacity-90 relative`}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                >
                  <div className="absolute inset-0 rounded-t-xl opacity-20 bg-white"></div>
                </div>
              </div>
              {/* Label */}
              <span className="text-xs font-semibold text-gray-500">{item.day}</span>
              <span className="text-xs font-bold text-gray-800">${item.revenue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
