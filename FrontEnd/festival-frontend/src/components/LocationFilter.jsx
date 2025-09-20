import React from 'react';

/**
 * 지역 필터링 컴포넌트
 * 시/군 선택을 위한 드롭다운 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Array} props.locations - 지역 리스트
 * @param {number} props.selectedLocationId - 선택된 지역 ID
 * @param {Function} props.onLocationChange - 지역 변경 핸들러
 * @param {boolean} props.loading - 로딩 상태
 */
const LocationFilter = ({ 
  locations, 
  selectedLocationId, 
  onLocationChange, 
  loading = false 
}) => {
  return (
    <div className="w-full">
      <label htmlFor="location-select" className="block text-sm font-medium text-gray-700 mb-2">
        지역 선택
      </label>
      <select
        id="location-select"
        value={selectedLocationId || ''}
        onChange={(e) => onLocationChange(Number(e.target.value) || null)}
        disabled={loading}
        className="input-field"
      >
        <option value="">전체 지역</option>
        {locations.map((location) => (
          <option key={location.locationId} value={location.locationId}>
            {location.locationName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;
