/**
 * Table card showing table status and order info
 */
export const TableCard = ({ table, orders, onTableClick }) => {
  const statusColors = {
    free: 'border-green-500 bg-green-50',
    occupied: 'border-amber-500 bg-amber-50',
    'bill-requested': 'border-red-500 bg-red-50',
    'water-requested': 'border-blue-500 bg-blue-50'
  };

  const statusEmoji = {
    free: '✅',
    occupied: '🍽️',
    'bill-requested': '💳',
    'water-requested': '💧'
  };

  const borderClass = statusColors[table.status] || statusColors.free;

  // Aggregate items count and total amount
  const activeOrdersCount = orders ? orders.length : 0;
  const totalItems = orders ? orders.reduce((sum, o) => sum + o.items.length, 0) : 0;
  const totalAmount = orders ? orders.reduce((sum, o) => sum + o.totalAmount, 0) : 0;
  const uniqueStatuses = orders ? Array.from(new Set(orders.map(o => o.status))).join(', ') : '';

  return (
    <button
      onClick={() => onTableClick(table)}
      className={`p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-lg text-left ${borderClass}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-2xl font-bold text-gray-900">Table {table.number}</h3>
        <span className="text-2xl">{statusEmoji[table.status]}</span>
      </div>

      {activeOrdersCount > 0 ? (
        <div className="text-sm text-gray-700 space-y-1">
          <p className="font-semibold">{activeOrdersCount} order(s) · {totalItems} item(s)</p>
          <p className="text-gray-600">
            Total: <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
          </p>
          <p className="text-xs text-gray-500 capitalize">Status: {uniqueStatuses}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No active orders</p>
      )}
    </button>
  );
};
