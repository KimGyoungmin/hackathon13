/**
 * KakaoMap 컴포넌트
 * 
 * 역할: 카카오맵 API를 래핑한 React 컴포넌트
 * - 카카오맵 초기화 및 렌더링
 * - 지도 이벤트 처리
 * - 지도 컨트롤 설정
 * 
 * Props:
 * - onMapReady: 지도가 준비되었을 때 호출되는 콜백 함수
 * - center: 지도 중심 좌표 {lat, lng}
 * - level: 지도 줌 레벨
 */
import React, { useEffect, useRef } from 'react';
import './styles/KakaoMap.css';

const KakaoMap = ({ 
  onMapReady, 
  center = { lat: 34.8679, lng: 126.9910 }, 
  level = 8 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // 카카오맵 API 로딩을 기다리는 함수
    const initializeMap = () => {
      // 카카오맵 API가 로드되고 초기화되었는지 확인
      if (!window.kakao || !window.kakao.maps || !window.kakaoMapLoaded) {
        console.log('카카오맵 API 초기화 대기 중...', {
          kakao: !!window.kakao,
          maps: !!(window.kakao && window.kakao.maps),
          loaded: window.kakaoMapLoaded
        });
        // 500ms 후 다시 시도
        setTimeout(initializeMap, 500);
        return;
      }

      // 카카오맵 API 완전 초기화 확인
      if (!window.kakao.maps.LatLng || typeof window.kakao.maps.LatLng !== 'function') {
        console.log('카카오맵 API 객체 초기화 대기 중...', {
          LatLng: !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng)
        });
        setTimeout(initializeMap, 500);
        return;
      }

      // 지도 컨테이너가 준비되었는지 확인
      if (!mapRef.current) {
        console.error('지도 컨테이너가 준비되지 않았습니다.');
        setTimeout(initializeMap, 100);
        return;
      }

      // 컨테이너의 크기가 0이면 잠시 기다렸다가 다시 시도
      const containerRect = mapRef.current.getBoundingClientRect();
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.log('지도 컨테이너 크기 확인 대기 중...');
        setTimeout(initializeMap, 100);
        return;
      }

      // 기존 지도 인스턴스가 있다면 제거
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }

      try {
        // 지도 옵션 설정
        const mapOption = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: level
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, mapOption);
        mapInstanceRef.current = map;

        // 지도 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 지도가 준비되었음을 부모 컴포넌트에 알림
        if (onMapReady) {
          onMapReady(map);
        }

        // 지도 클릭 이벤트 (선택사항)
        window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
          const latlng = mouseEvent.latLng;
          console.log('지도 클릭 위치:', latlng.getLat(), latlng.getLng());
        });

        // 지도 드래그 이벤트 (선택사항)
        window.kakao.maps.event.addListener(map, 'dragend', () => {
          const center = map.getCenter();
          console.log('지도 중심 변경:', center.getLat(), center.getLng());
        });

        console.log('카카오맵 초기화 완료');
      } catch (error) {
        console.error('카카오맵 초기화 실패:', error);
      }
    };

    // 카카오맵 준비 이벤트 리스너 추가
    const handleKakaoMapReady = () => {
      console.log('카카오맵 준비 이벤트 수신');
      initializeMap();
    };

    // 이벤트 리스너 등록
    window.addEventListener('kakaoMapReady', handleKakaoMapReady);

    // 지도 초기화 시작 (이미 로드된 경우를 위해)
    initializeMap();

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('kakaoMapReady', handleKakaoMapReady);
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };

  }, [center.lat, center.lng, level, onMapReady]);

  return (
    <div className="kakao-map">
      <div 
        ref={mapRef} 
        className="kakao-map__container"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default KakaoMap;
