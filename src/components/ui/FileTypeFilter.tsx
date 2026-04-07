'use client';

import { FileCategory, getCategoryLabel } from '@/utils/fileTypeUtils';

interface FileTypeFilterProps {
  selectedCategories: FileCategory[];
  onCategoriesChange: (categories: FileCategory[]) => void;
}

const filterOptions: FileCategory[] = ['workspaces', 'images', 'videos', 'other', 'folder'];

export function FileTypeFilter({ selectedCategories, onCategoriesChange }: FileTypeFilterProps) {
  const toggleCategory = (category: FileCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const selectAll = () => {
    onCategoriesChange(filterOptions);
  };

  const clearAll = () => {
    onCategoriesChange([]);
  };

  return (
    <div className="bg-[#121212] border border-white/5 p-6 lg:p-8">
      <div className="mb-6">
        <h3 className="text-[11px] font-sans font-semibold uppercase tracking-widest text-white mb-4">
          Filter by Type
        </h3>
        <div className="space-y-2 flex flex-col gap-2">
          <button
            onClick={selectAll}
            className="text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors text-left py-2 px-2 hover:bg-white/5 rounded"
            title="Select all file types"
          >
            ✓ All Types
          </button>
          <button
            onClick={clearAll}
            className="text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors text-left py-2 px-2 hover:bg-white/5 rounded"
            title="Deselect all file types"
          >
            ✕ Clear All
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 pt-6 space-y-3">
        <p className="text-[10px] font-sans text-gray-600 uppercase tracking-widest">Selected: {selectedCategories.length}</p>
        {filterOptions.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer text-[12px] font-sans transition-all hover:bg-white/5 p-2 rounded -mx-2 select-none"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCategory(category)}
                className="w-5 h-5 accent-white bg-[#1A1A1A] border border-white/20 rounded hover:border-white/40 cursor-pointer"
                title={`Toggle ${getCategoryLabel(category)} filter`}
              />
              <span className={`${isSelected ? 'text-white font-medium' : 'text-gray-500'}`}>
                {getCategoryLabel(category)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
