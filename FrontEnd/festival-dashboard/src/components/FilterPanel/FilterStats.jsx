/**
 * FilterStats 컴포넌트
 * 
 * 역할: 필터 통계 정보를 표시
 * - 선택된 지역 수
 * - 선택된 카테고리 수
 * - 전체 축제 수
 * - 필터된 축제 수
 * 
 * Props:
 * - selectedRegions: 선택된 지역 수
 * - selectedCategories: 선택된 카테고리 수
 * - totalFestivals: 전체 축제 수
 * - filteredFestivals: 필터된 축제 수
 */
import React from 'react';
import './styles/FilterStats.css';

const FilterStats = ({ 
  selectedRegions = 0,
  selectedCategories = 0,
  selectedFestivals = 0,
  totalFestivals = 0,
  filteredFestivals = []
}) => {
  const stats = [
    {
      label: '선택된 축제',
      value: selectedFestivals,
      icon: '🎪',
      color: 'var(--primary)'
    },
    {
      label: '선택된 지역',
      value: selectedRegions,
      icon: '📍',
      color: 'var(--secondary)'
    },
    {
      label: '선택된 카테고리',
      value: selectedCategories,
      icon: '🏷️',
      color: 'var(--accent)'
    },
    {
      label: '전체 축제',
      value: 61, // 고정값 (중복 제거 후 실제 축제 수)
      icon: '📊',
      color: 'var(--info)'
    }
  ];

  return (
    <div className="filter-stats">
      <div className="filter-stats__grid">
        {stats.map((stat, index) => (
          <div key={index} className="filter-stat-card">
            <div className="filter-stat-card__icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="filter-stat-card__content">
              <div className="filter-stat-card__value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="filter-stat-card__label">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterStats;
