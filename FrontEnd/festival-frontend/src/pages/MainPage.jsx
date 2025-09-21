import React, { useState, useEffect } from 'react';
import LocationFilter from '../components/LocationFilter';
import CategoryFilter from '../components/CategoryFilter';
import FestivalList from '../components/FestivalList';
import festivalService from '../services/festivalService';

/**
 * 메인 페이지 컴포넌트
 * 축제 필터링 기능을 제공하는 메인 페이지
 * 시/군 필터링과 축제 카테고리 필터링을 지원합니다.
 */
const MainPage = () => {
  // 상태 관리
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 컴포넌트 마운트 시 지역 정보 로드
  useEffect(() => {
    loadLocations();
    loadCategories();
  }, []);

  // 지역 선택 변경 시 축제 목록 업데이트
  useEffect(() => {
    if (selectedLocationId) {
      loadFestivals();
    } else {
      setFestivals([]);
      setSelectedCategoryIds([]);
    }
  }, [selectedLocationId]);

  // 카테고리 선택 변경 시 축제 목록 업데이트
  useEffect(() => {
    if (selectedLocationId) {
      loadFestivals();
    }
  }, [selectedCategoryIds]);

  /**
   * 지역 정보를 로드합니다.
   */
  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const locationsData = await festivalService.getAllLocations();
      setLocations(locationsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 카테고리 정보를 로드합니다.
   * 현재는 하드코딩된 카테고리를 사용합니다.
   */
  const loadCategories = () => {
    const categoriesData = [
      { categoryId: 1, categoryName: '문화예술' },
      { categoryId: 2, categoryName: '음식' },
      { categoryId: 3, categoryName: '스포츠' },
      { categoryId: 4, categoryName: '전통' },
      { categoryId: 5, categoryName: '국제' }
    ];
    setCategories(categoriesData);
  };

  /**
   * 필터링된 축제 목록을 로드합니다.
   */
  const loadFestivals = async () => {
    if (!selectedLocationId) return;

    try {
      setLoading(true);
      setError(null);
      
      const festivalsData = selectedCategoryIds.length > 0
        ? await festivalService.getFestivalsByLocationAndCategories(selectedLocationId, selectedCategoryIds)
        : await festivalService.getFestivalsByLocation(selectedLocationId);
      
      setFestivals(festivalsData);
    } catch (err) {
      setError(err.message);
      setFestivals([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 지역 변경 핸들러
   * @param {number|null} locationId - 선택된 지역 ID
   */
  const handleLocationChange = (locationId) => {
    setSelectedLocationId(locationId);
  };

  /**
   * 카테고리 변경 핸들러
   * @param {Array<number>} categoryIds - 선택된 카테고리 ID 리스트
   */
  const handleCategoryChange = (categoryIds) => {
    setSelectedCategoryIds(categoryIds);
  };

  // 선택된 지역명 가져오기
  const selectedLocationName = locations.find(loc => loc.locationId === selectedLocationId)?.locationNm || '';

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* 헤더 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              전라남도 축제 대시보드
            </h1>
            <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto">
              14개 시군의 다양한 축제를 한눈에 탐색하고, 지역별·카테고리별로 필터링해보세요
            </p>
            <div className="mt-8 flex justify-center space-x-6 text-white text-opacity-80">
              <div className="text-center">
                <div className="text-3xl font-bold">520</div>
                <div className="text-sm">축제 데이터</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm">시군</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm">카테고리</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        {/* 필터 섹션 */}
        <div className="card mb-8" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
            <div style={{width: '2rem', height: '2rem', background: 'linear-gradient(to right, #3b82f6, #9333ea)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem'}}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">필터 설정</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <LocationFilter
              locations={locations}
              selectedLocationId={selectedLocationId}
              onLocationChange={handleLocationChange}
              loading={loading}
            />
            
            <CategoryFilter
              categories={categories}
              selectedCategoryIds={selectedCategoryIds}
              onCategoryChange={handleCategoryChange}
              loading={loading}
              disabled={!selectedLocationId}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    오류가 발생했습니다
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 축제 목록 섹션 */}
        <div className="card" style={{background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
          <FestivalList
            festivals={festivals}
            loading={loading}
            selectedLocationName={selectedLocationName}
          />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
