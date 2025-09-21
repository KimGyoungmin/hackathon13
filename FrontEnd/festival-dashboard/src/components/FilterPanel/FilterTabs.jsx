/**
 * FilterTabs 컴포넌트
 * 
 * 역할: 필터 탭 전환을 담당
 * - 지역별/카테고리별 탭
 * - 활성 탭 표시
 * - 탭 클릭 이벤트 처리
 * 
 * Props:
 * - activeTab: 현재 활성화된 탭 ('region' | 'category')
 * - onTabChange: 탭 변경 시 호출되는 함수
 */
import React from 'react';
import './styles/FilterTabs.css';

const FilterTabs = ({ activeTab = 'region', onTabChange }) => {
  const tabs = [
    { id: 'region', label: '지역별' },
    { id: 'category', label: '카테고리별' }
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="filter-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`filter-tab ${activeTab === tab.id ? 'filter-tab--active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
