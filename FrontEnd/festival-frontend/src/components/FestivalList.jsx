import React from 'react';

/**
 * 축제 목록 컴포넌트
 * 필터링된 축제들을 카드 형태로 표시하는 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.festivals - 축제 리스트
 * @param {boolean} props.loading - 로딩 상태
 * @param {string} props.selectedLocationName - 선택된 지역명
 */
const FestivalList = ({ festivals = [], loading = false, selectedLocationName = '' }) => {
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">축제 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (festivals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 4c-2.34 0-4.29 1.009-5.824 2.709" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {selectedLocationName ? `${selectedLocationName}에 축제가 없습니다` : '축제를 찾을 수 없습니다'}
        </h3>
        <p className="text-gray-500">
          다른 지역이나 카테고리를 선택해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedLocationName ? `${selectedLocationName} 축제` : '축제 목록'}
        </h2>
        <span className="text-sm text-gray-500">
          총 {festivals.length}개의 축제
        </span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {festivals.map((festival) => (
          <div key={festival.festivalId} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {festival.festivalName}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>축제 ID: {festival.festivalId}</p>
                  <p>카테고리 ID: {festival.categoryId}</p>
                  <p>지역 ID: {festival.locationId}</p>
                </div>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  축제
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FestivalList;
