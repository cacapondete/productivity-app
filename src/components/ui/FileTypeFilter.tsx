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
        <div className="flex gap-3">
          <button
            onClick={selectAll}
            className="text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            All
          </button>
          <span className="text-gray-600">•</span>
          <button
            onClick={clearAll}
            className="text-[10px] font-sans font-semibold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filterOptions.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer text-[12px] font-sans transition-colors hover:text-white"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 accent-white bg-[#1A1A1A] border border-white/10 rounded"
              />
              <span className={isSelected ? 'text-white' : 'text-gray-500'}>
                {getCategoryLabel(category)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
