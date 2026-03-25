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
    <div className="bg-white border-b border-gray-100 shadow-sm z-20 sticky top-[61px]">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar"
      >
        {categories.map(category => (
          <button
            key={category.id}
            data-active={category.id === selectedCategoryId}
            onClick={() => onCategorySelect(category.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold whitespace-nowrap text-sm transition-all duration-200 border ${
              category.id === selectedCategoryId
                ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
            }`}
          >
            <span className="text-base leading-none">{category.icon}</span>
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
