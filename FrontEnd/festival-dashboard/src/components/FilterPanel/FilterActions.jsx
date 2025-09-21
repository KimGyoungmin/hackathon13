/**
 * FilterActions 컴포넌트
 * 
 * 역할: 필터 액션 버튼들을 담당
 * - 전체 선택 버튼
 * - 초기화 버튼
 * - 버튼 클릭 이벤트 처리
 * 
 * Props:
 * - onSelectAll: 전체 선택 버튼 클릭 시 호출되는 함수
 * - onReset: 초기화 버튼 클릭 시 호출되는 함수
 * - disabled: 버튼 비활성화 여부
 */
import React from 'react';
import './styles/FilterActions.css';

const FilterActions = ({ 
  onSelectAll, 
  onReset, 
  disabled = false 
}) => {
  return (
    <div className="filter-actions">
      <button
        className="filter-action-btn filter-action-btn--outline"
        onClick={onSelectAll}
        disabled={disabled}
        type="button"
      >
        전체 선택
      </button>
      <button
        className="filter-action-btn filter-action-btn--secondary"
        onClick={onReset}
        disabled={disabled}
        type="button"
      >
        초기화
      </button>
    </div>
  );
};

export default FilterActions;
