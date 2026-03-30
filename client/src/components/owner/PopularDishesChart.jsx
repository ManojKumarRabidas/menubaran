/**
 * Popular dishes chart — gradient bars with rank medals, percentages, category badges
 */
export const PopularDishesChart = ({ items = [] }) => {
  const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  const topItems = [...items]
    .sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
    .slice(0, 5);

  const maxCount = Math.max(...topItems.map(i => i.orderCount || 0), 1);

  const barGradients = [
    'from-violet-500 to-purple-600',
    'from-indigo-500 to-blue-500',
    'from-blue-500 to-cyan-400',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Most Popular Dishes</h3>
          <p className="text-sm text-gray-500 mt-0.5">Based on total orders</p>
        </div>
        <span className="text-2xl">🏆</span>
      </div>

      {topItems.length > 0 ? (
        <div className="space-y-5">
          {topItems.map((item, idx) => {
            const pct = Math.round(((item.orderCount || 0) / maxCount) * 100);
            return (
              <div key={item._id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{MEDALS[idx]}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.description?.substring(0, 40) || ''}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-sm font-extrabold text-indigo-600">{item.orderCount || 0}</p>
                    <p className="text-xs text-gray-400">orders</p>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${barGradients[idx]} rounded-full transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-xs text-gray-400">₹{item.price?.toFixed(2)}</span>
                  <span className="text-xs font-semibold text-gray-500">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">No order data available</p>
      )}
    </div>
  );
};
