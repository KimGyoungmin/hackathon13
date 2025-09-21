/**
 * 재사용 가능한 필터 버튼 컴포넌트
 * Atomic Design의 Atom 레벨
 */
import React from 'react';
import './FilterButton.css';

const FilterButton = ({ 
  label, 
  isActive = false, 
  onClick, 
  variant = 'default',
  size = 'medium',
  disabled = false,
  className = ''
}) => {
  const getButtonClass = () => {
    const baseClass = 'filter-button';
    const variantClass = `filter-button--${variant}`;
    const sizeClass = `filter-button--${size}`;
    const activeClass = isActive ? 'filter-button--active' : '';
    const disabledClass = disabled ? 'filter-button--disabled' : '';
    
    return `${baseClass} ${variantClass} ${sizeClass} ${activeClass} ${disabledClass} ${className}`.trim();
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  );
};

export default FilterButton;
