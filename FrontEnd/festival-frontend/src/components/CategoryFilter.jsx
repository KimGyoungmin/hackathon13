import React from 'react';

/**
 * 카테고리 필터링 컴포넌트
 * 축제 카테고리 다중 선택을 위한 체크박스 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.categories - 카테고리 리스트
 * @param {Array} props.selectedCategoryIds - 선택된 카테고리 ID 리스트
 * @param {Function} props.onCategoryChange - 카테고리 변경 핸들러
 * @param {boolean} props.loading - 로딩 상태
 * @param {boolean} props.disabled - 비활성화 상태 (지역이 선택되지 않았을 때)
 */
const CategoryFilter = ({ 
  categories, 
  selectedCategoryIds = [], 
  onCategoryChange, 
  loading = false,
  disabled = false 
}) => {
  
  /**
   * 카테고리 선택/해제 핸들러
   * @param {number} categoryId - 카테고리 ID
   */
  const handleCategoryToggle = (categoryId) => {
    if (disabled) return;
    
    const newSelectedIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter(id => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    
    onCategoryChange(newSelectedIds);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        축제 카테고리 (다중 선택 가능)
      </label>
      <div className="space-y-2">
        {categories.map((category) => (
          <label key={category.categoryId} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategoryIds.includes(category.categoryId)}
              onChange={() => handleCategoryToggle(category.categoryId)}
              disabled={loading || disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {category.categoryName}
            </span>
          </label>
        ))}
      </div>
      {disabled && (
        <p className="text-xs text-gray-500 mt-2">
          지역을 먼저 선택해주세요.
        </p>
      )}
    </div>
  );
};

export default CategoryFilter;
