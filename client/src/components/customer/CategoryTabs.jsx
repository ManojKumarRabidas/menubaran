import { useRef, useEffect } from 'react';

/**
 * Sticky horizontal scrollable category tabs
 */
export const CategoryTabs = ({ categories, selectedCategoryId, onCategorySelect }) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedTab = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (selectedTab) {
        selectedTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategoryId]);

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar"
      >
        {categories.map(category => (
          <button
            key={category.id}
            data-active={category.id === selectedCategoryId}
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ${
              category.id === selectedCategoryId
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
