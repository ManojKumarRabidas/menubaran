/**
 * Menu item card displaying item details with gradient placeholder
 */
export const MenuItemCard = ({ item, onAddClick }) => {
  const isVeg = item.isVeg;
  const isAvailable = item.isAvailable !== false; // handle null/undefined as true

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 flex flex-col ${
      !isAvailable ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md hover:-translate-y-0.5'
    }`}>
      {/* Image / Gradient Area */}
      <div
        className={`relative h-44 bg-gradient-to-br ${item.gradientFrom || 'from-amber-400'} ${item.gradientTo || 'to-orange-500'} flex items-center justify-center`}
      >
        <span className="text-5xl opacity-60">{item.emoji || '🍽️'}</span>

        {/* Veg / Non-Veg Indicator */}
        <div className={`absolute top-3 left-3 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${
          isVeg
            ? 'border-green-600 bg-white'
            : 'border-red-600 bg-white'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
        </div>

        {/* Popular Badge */}
        {item.isPopular && isAvailable && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            ⭐ Popular
          </div>
        )}

        {/* Unavailable Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-red-600 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-lg transform -rotate-12">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base text-gray-900 leading-snug mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-gray-900">₹{item.price.toFixed(0)}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              ⏱ {item.preparationTimeMinutes || 10} min
            </span>
          </div>
          <button
            onClick={() => isAvailable && onAddClick(item)}
            disabled={!isAvailable}
            className={`flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-sm transition-all duration-150 shadow-sm ${
              isAvailable 
                ? 'bg-amber-600 hover:bg-amber-700 active:scale-95 text-white' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAvailable ? (
              <>
                <span className="text-base leading-none">＋</span> Add
              </>
            ) : (
              'Unavailable'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
