/**
 * SVG Donut Chart for revenue by category
 */
export const DonutChart = ({ segments = [] }) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = -90; // start from top
  const arcs = segments.map(seg => {
    const fraction = seg.value / total;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + angle) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...seg,
      fraction,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    };
  });

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Category</h3>
      <div className="flex items-center gap-6">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {arcs.map((arc, i) => (
              <path
                key={arc.label}
                d={arc.path}
                fill={COLORS[i % COLORS.length]}
                className="hover:opacity-80 transition cursor-pointer"
              />
            ))}
            {/* Inner circle (cutout) */}
            <circle cx={cx} cy={cy} r={38} fill="white" />
            <text x={cx} y={cy - 6} textAnchor="middle" className="text-xs" fontSize="11" fontWeight="600" fill="#374151">
              Total
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">
              ₹{total.toFixed(0)}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {arcs.map((arc, i) => (
            <div key={arc.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }}></span>
                <span className="text-sm text-gray-700 font-medium">{arc.label}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{(arc.fraction * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
