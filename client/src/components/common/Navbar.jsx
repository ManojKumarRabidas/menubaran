/**
 * Customer navbar showing restaurant name and table number
 */
export const Navbar = ({ restaurantName, tableNumber }) => {
  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <span className="text-white text-lg">🍽️</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {restaurantName || 'Restaurant'}
            </h1>
            <p className="text-xs text-gray-400 font-medium">Digital Menu</p>
          </div>
        </div>

        {/* Table Badge */}
        {tableNumber && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl shadow-sm">
            <span className="text-sm">🪑</span>
            <span className="text-sm font-bold">Table {tableNumber}</span>
          </div>
        )}
      </div>
    </nav>
  );
};
