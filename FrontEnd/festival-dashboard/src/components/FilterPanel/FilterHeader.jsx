/**
 * FilterHeader 컴포넌트
 * 
 * 역할: 필터 패널의 헤더 부분을 담당
 * - 제목 표시
 * - 간단한 설명 텍스트
 * 
 * Props:
 * - title: 헤더 제목 (기본값: "축제 필터링")
 * - subtitle: 부제목 (선택사항)
 */
import React from 'react';
import './styles/FilterHeader.css';

const FilterHeader = ({ 
  title = "축제 필터링", 
  subtitle = "지역과 카테고리로 축제를 필터링하세요" 
}) => {
  return (
    <div className="filter-header">
      <h2 className="filter-header__title">{title}</h2>
      {subtitle && (
        <p className="filter-header__subtitle">{subtitle}</p>
      )}
    </div>
  );
};

export default FilterHeader;
