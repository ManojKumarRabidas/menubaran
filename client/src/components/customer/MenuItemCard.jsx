/**
 * Menu item card displaying item details with gradient placeholder
 */
export const MenuItemCard = ({ item, onAddClick }) => {
  const vegIndicator = item.isVeg ? '🟢' : '🔴';
  const popularBadge = item.isPopular ? '⭐' : '';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Gradient Image Placeholder */}
      <div
        className={`h-40 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} flex items-center justify-center`}
      >
        <span className="text-4xl opacity-50">🍽️</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
          <span className="text-sm">{vegIndicator}</span>
        </div>

        {item.isPopular && (
          <div className="inline-block text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded mb-2">
            {popularBadge} Popular
          </div>
        )}

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            ⏱️ {item.preparationTimeMinutes} min
          </div>
          <span className="font-bold text-lg text-orange-600">${item.price.toFixed(2)}</span>
        </div>

        <button
          onClick={() => onAddClick(item)}
          className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
        >
          + Add
        </button>
      </div>
    </div>
  );
};
