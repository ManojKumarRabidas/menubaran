/**
 * Customer navbar showing restaurant name and table number
 */
export const Navbar = ({ restaurantName, tableNumber }) => {
  return (
    <nav className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{restaurantName || 'Restaurant'}</h1>
        </div>
        {tableNumber && (
          <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold">
            🍽️ Table {tableNumber}
          </div>
        )}
      </div>
    </nav>
  );
};
