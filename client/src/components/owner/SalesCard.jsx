/**
 * Enhanced KPI card with gradient, trend badge, and subtitle
 */
export const SalesCard = ({ icon, label, value, unit = '', trend = null, trendLabel = '', gradient = 'from-indigo-500 to-purple-600', subtitle = '' }) => {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-5 text-white overflow-hidden hover:shadow-xl transition-shadow duration-200`}>
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{icon}</div>
          {trend !== null && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend >= 0 ? 'bg-white/20' : 'bg-red-400/30'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-white/70 text-sm font-semibold mb-1">{label}</p>
        <p className="text-3xl font-extrabold leading-tight">
          {value}
          {unit && <span className="text-base font-medium text-white/60 ml-1">{unit}</span>}
        </p>
        {subtitle && <p className="text-white/60 text-xs mt-1.5">{subtitle}</p>}
        {trendLabel && <p className="text-white/50 text-xs mt-0.5">{trendLabel}</p>}
      </div>
    </div>
  );
};
