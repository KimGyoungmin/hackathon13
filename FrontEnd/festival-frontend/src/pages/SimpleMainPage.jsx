import React, { useState, useEffect } from 'react';
import LocationFilter from '../components/LocationFilter';
import CategoryFilter from '../components/CategoryFilter';
import FestivalList from '../components/FestivalList';
import FestivalChart from '../components/FestivalChart';
import festivalService from '../services/festivalService';

/**
 * 전라남도 축제 대시보드 - 간단한 버전
 */
const SimpleMainPage = () => {
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

  const loadCategories = () => {
    const categoriesData = [
      { categoryId: 1, categoryName: '문화/역사' },
      { categoryId: 2, categoryName: '음식/미식' },
      { categoryId: 3, categoryName: '자연/계절' },
      { categoryId: 4, categoryName: '체험/레저' },
      { categoryId: 5, categoryName: '일반/기타' }
    ];
    setCategories(categoriesData);
  };

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

  const handleLocationChange = (locationId) => {
    setSelectedLocationId(locationId);
  };

  const handleCategoryChange = (categoryIds) => {
    setSelectedCategoryIds(categoryIds);
  };

  const selectedLocationName = locations.find(loc => loc.locationId === selectedLocationId)?.locationNm || '';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 헤더 */}
      <header style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '4rem 0'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}></div>
        <div style={{
          position: 'relative',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <svg style={{width: '2rem', height: '2rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            전라남도 축제 대시보드
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '32rem',
            margin: '0 auto'
          }}>
            14개 시군의 다양한 축제를 한눈에 탐색하고, 지역별·카테고리별로 필터링해보세요
          </p>
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold'}}>520</div>
              <div style={{fontSize: '0.875rem'}}>축제 데이터</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold'}}>14</div>
              <div style={{fontSize: '0.875rem'}}>시군</div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold'}}>5</div>
              <div style={{fontSize: '0.875rem'}}>카테고리</div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{
        position: 'relative',
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1rem',
        marginTop: '-2rem'
      }}>
        {/* 필터 섹션 */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          border: '1px solid rgba(229,231,235,0.8)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              background: 'linear-gradient(to right, #3b82f6, #9333ea)',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <svg style={{width: '1.25rem', height: '1.25rem', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827'
            }}>필터 설정</h2>
          </div>
          
          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
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
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.375rem'
            }}>
              <div style={{color: '#dc2626', fontSize: '0.875rem'}}>
                오류가 발생했습니다: {error}
              </div>
            </div>
          )}
        </div>

        {/* 축제 차트 섹션 */}
        {festivals.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: '1px solid rgba(229,231,235,0.8)',
            marginBottom: '2rem'
          }}>
            <FestivalChart
              festivals={festivals}
              selectedLocationName={selectedLocationName}
            />
          </div>
        )}

        {/* 축제 목록 섹션 */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          border: '1px solid rgba(229,231,235,0.8)',
          padding: '1.5rem'
        }}>
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

export default SimpleMainPage;
