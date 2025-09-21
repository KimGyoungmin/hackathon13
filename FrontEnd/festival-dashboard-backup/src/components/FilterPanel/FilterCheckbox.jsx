/**
 * 재사용 가능한 필터 체크박스 컴포넌트
 * Atomic Design의 Atom 레벨
 */
import React from 'react';
import './FilterCheckbox.css';

const FilterCheckbox = ({ 
  id,
  label, 
  checked = false, 
  onChange, 
  disabled = false,
  showCount = false,
  count = 0,
  className = ''
}) => {
  const handleChange = (e) => {
    if (onChange && !disabled) {
      onChange(e.target.checked, id);
    }
  };

  return (
    <div className={`filter-checkbox ${className}`}>
      <label className="filter-checkbox__label" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="filter-checkbox__input"
        />
        <span className="filter-checkbox__checkmark"></span>
        <span className="filter-checkbox__text">
          {label}
          {showCount && count > 0 && (
            <span className="filter-checkbox__count">({count})</span>
          )}
        </span>
      </label>
    </div>
  );
};

export default FilterCheckbox;
