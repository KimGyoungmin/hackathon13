import React, { useState, useEffect, useCallback } from 'react';
import Chart from 'chart.js/auto';
import './ChartOnlyPanel.css';

const ChartOnlyPanel = ({ selectedFestivals, selectedYears, allFestivals }) => {

  // 툴팁 상태 관리
  const [showTooltip, setShowTooltip] = useState({
    revenue: false,
    promotion: false,
    budget: false,
    lodging: false
  });
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const iconRefs = {
    revenue: React.useRef(null),
    promotion: React.useRef(null),
    budget: React.useRef(null),
    lodging: React.useRef(null)
  };

  // 차트 인스턴스를 저장할 ref
  const chartRefs = {
    revenue: React.useRef(null),
    promotion: React.useRef(null),
    budget: React.useRef(null),
    lodging: React.useRef(null)
  };

  // 툴팁 핸들러 함수들
  const handleTooltipShow = (chartType) => {
    const rect = iconRefs[chartType].current.getBoundingClientRect();
    setTooltipPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    });
    setShowTooltip(prev => ({ ...prev, [chartType]: true }));
  };

  const handleTooltipHide = (chartType) => {
    setShowTooltip(prev => ({ ...prev, [chartType]: false }));
  };

  // API에서 축제 상세 데이터 가져오기
  const fetchFestivalDetails = async (selectedFestivalIds, years) => {
    try {
      // 모든 데이터를 가져온 후 프론트엔드에서 필터링
      const url = `http://localhost:8080/api/festivals/details`;
      console.log('🔗 API 호출 URL:', url);
      console.log('🎯 필터링할 축제 ID들:', selectedFestivalIds);
      console.log('📅 필터링할 연도들:', years);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch festival details');
      }
      const allData = await response.json();
      console.log('📊 전체 받은 데이터 개수:', allData.length);

      // 프론트엔드에서 필터링
      let filteredData = allData;

      // 축제 ID로 필터링 (선택된 축제만)
      if (selectedFestivalIds && selectedFestivalIds.length > 0) {
        filteredData = filteredData.filter(item => selectedFestivalIds.includes(item.festivalId));
        console.log('🎪 축제 ID 필터링 후:', filteredData.length, '개');
      }

      // 연도 필터링
      if (years && years.length > 0) {
        filteredData = filteredData.filter(item => years.includes(item.year));
        console.log('📅 연도 필터링 후:', filteredData.length, '개');
      }

      console.log('📊 최종 필터링된 데이터:', filteredData);
      return filteredData;
    } catch (error) {
      console.error('Error fetching festival details:', error);
      return [];
    }
  };

  // 차트 타입 결정 함수 (요구사항에 맞게 수정)
  const getChartType = useCallback((festivalCount, yearCount) => {
    console.log(`🎯 차트 타입 결정: 축제 ${festivalCount}개, 년도 ${yearCount}개`);

    if (festivalCount === 1 && yearCount === 1) {
      console.log('📊 차트 타입: 단일축제+단일년도 → Bar');
      return 'bar';
    }
    if (festivalCount >= 2 && yearCount === 1) {
      console.log('📊 차트 타입: 다중축제+단일년도 → Bar');
      return 'bar';
    }
    if (festivalCount === 1 && yearCount >= 2) {
      console.log('📊 차트 타입: 단일축제+다중년도 → Line');
      return 'line';
    }
    if (festivalCount >= 2 && yearCount >= 2) {
      console.log('📊 차트 타입: 다중축제+다중년도 → Line');
      return 'line';
    }

    console.log('📊 차트 타입: 기본값 → Bar');
    return 'bar';
  }, []);

  // 축제별 색상 팔레트
  const getFestivalColors = useCallback((festivalNames) => {
    const colorPalette = [
      'rgba(59, 130, 246, 0.8)',   // 파란색
      'rgba(16, 185, 129, 0.8)',   // 초록색
      'rgba(245, 158, 11, 0.8)',   // 주황색
      'rgba(239, 68, 68, 0.8)',    // 빨간색
      'rgba(139, 92, 246, 0.8)',   // 보라색
      'rgba(236, 72, 153, 0.8)',   // 핑크색
      'rgba(6, 182, 212, 0.8)',    // 청록색
      'rgba(34, 197, 94, 0.8)',    // 라임색
      'rgba(251, 146, 60, 0.8)',   // 오렌지색
      'rgba(168, 85, 247, 0.8)',   // 바이올렛색
    ];

    const borderColorPalette = [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(239, 68, 68, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(6, 182, 212, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(251, 146, 60, 1)',
      'rgba(168, 85, 247, 1)',
    ];

    return festivalNames.map((_, index) => ({
      backgroundColor: colorPalette[index % colorPalette.length],
      borderColor: borderColorPalette[index % borderColorPalette.length]
    }));
  }, []);

  // 차트 데이터 준비 함수
  const prepareChartData = useCallback((data, dataKey, label) => {
    if (!data || data.length === 0) return null;

    // 매출과 예산 데이터를 백만원 단위로 변환 (1인당 평균 지출액은 제외)
    const convertedData = data.map(item => ({
      ...item,
      [dataKey]: (dataKey === 'grossSales' || dataKey === 'budgetKrw') 
        ? Math.round((item[dataKey] || 0) / 1000000) 
        : item[dataKey]
    }));

    const festivalNames = [...new Set(convertedData.map(item => item.festivalName))];
    const years = [...new Set(convertedData.map(item => item.year))].sort();

    const chartType = getChartType(festivalNames.length, years.length);

    if (chartType === 'bar') {
      if (festivalNames.length === 1 && years.length === 1) {
        // 단일 축제 + 단일 년도: 축제명을 라벨로
        const labels = festivalNames;
        const chartData = [convertedData[0] ? convertedData[0][dataKey] || 0 : 0];
        const colors = getFestivalColors(festivalNames);

        return {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label,
              data: chartData,
              backgroundColor: colors[0].backgroundColor,
              borderColor: colors[0].borderColor,
              borderWidth: 1
            }]
          }
        };
      } else if (festivalNames.length >= 2 && years.length === 1) {
        // 다중 축제 + 단일 년도: 축제명들을 라벨로
        const labels = festivalNames;
        const chartData = labels.map(festivalName => {
          const festivalData = data.find(item => item.festivalName === festivalName);
          return festivalData ? festivalData[dataKey] || 0 : 0;
        });
        const colors = getFestivalColors(festivalNames);

        return {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label,
              data: chartData,
              backgroundColor: colors.map(color => color.backgroundColor),
              borderColor: colors.map(color => color.borderColor),
              borderWidth: 1
            }]
          }
        };
      }
    } else {
      // Line 차트 데이터 (단일축제+다중년도 또는 다중축제+다중년도)
      const colors = getFestivalColors(festivalNames);
      const datasets = festivalNames.map((festivalName, index) => {
        const festivalData = convertedData.filter(item => item.festivalName === festivalName);
        const dataPoints = years.map(year => {
          const yearData = festivalData.find(item => item.year === year);
          return yearData ? yearData[dataKey] || 0 : 0;
        });

        return {
          label: festivalName,
          data: dataPoints,
          borderColor: colors[index].borderColor,
          backgroundColor: colors[index].backgroundColor,
          fill: false,
          tension: 0.1
        };
      });

      return {
        type: 'line',
        data: {
          labels: years.map(y => y.toString()),
          datasets
        }
      };
    }

    return null;
  }, [getChartType, getFestivalColors]);

  // 차트 생성/업데이트 함수
  const createChart = useCallback((canvasId, chartConfig) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 기존 차트 삭제
    if (chartRefs[canvasId].current) {
      chartRefs[canvasId].current.destroy();
    }

    // 새 차트 생성
    chartRefs[canvasId].current = new Chart(ctx, {
      type: chartConfig.type,
      data: chartConfig.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // 범례 숨김으로 차트 공간 확보
          },
          tooltip: {
            enabled: true,
            mode: 'nearest', // 가장 가까운 데이터 포인트만 표시
            intersect: true, // 정확히 교차하는 지점에서만 표시
            backgroundColor: 'rgba(255, 255, 255, 0.95)', // 투명한 하얀색 배경
            titleColor: '#333333', // 검은색 제목
            bodyColor: '#333333', // 검은색 본문
            borderColor: 'rgba(45, 80, 22, 0.3)', // 연한 테두리
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            titleFont: {
              size: 14,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            padding: 12,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function(context) {
                const dataset = context.dataset;
                const value = context.parsed.y;
                let unit = '';
                let displayValue = value;
                
                // 바 차트이고 매출/예산일 때 값 변환
                if (chartConfig.type === 'bar' && (canvasId === 'revenue' || canvasId === 'budget')) {
                  displayValue = Math.round(value / 1000000);
                }
                
                // 단위 설정
                if (canvasId === 'revenue' || canvasId === 'budget') {
                  unit = ''; // 백만원 단위는 라벨에 이미 표시되어 있으므로 제거
                } else if (canvasId === 'promotion') {
                  unit = '건';
                } else if (canvasId === 'lodging') {
                  unit = '명';
                }
                
                return `${dataset.label}: ${displayValue.toLocaleString()}${unit}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              display: false, // ChartOnlyPanel에서는 항상 축제명이 X축이므로 숨김
            },
            grid: {
              display: false,
            },
            title: {
              display: false, // X축 제목도 숨김
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                // 바 차트이고 매출/예산 차트일 때만 백만원 단위로 표시
                if (chartConfig.type === 'bar' && (canvasId === 'revenue' || canvasId === 'budget')) {
                  return Math.round(value / 1000000).toLocaleString();
                }
                // 일 평균 방문객 차트는 명 단위로 표시
                if (canvasId === 'lodging') {
                  return value.toLocaleString() + '명';
                }
                return value.toLocaleString();
              }
            },
            title: {
              display: false
            }
          }
        }
      }
    });
  }, [chartRefs]);

  // 데이터 업데이트
  useEffect(() => {
    const updateCharts = async () => {
      console.log('🎪 선택된 축제들(축제명 배열):', selectedFestivals);
      console.log('🎪 모든 축제 데이터:', allFestivals);

      if (!selectedFestivals || selectedFestivals.length === 0) {
        console.log('❌ 선택된 축제가 없습니다');
        // 선택된 축제가 없으면 모든 차트를 초기화
        Object.values(chartRefs).forEach(ref => {
          if (ref.current) {
            ref.current.destroy();
            ref.current = null;
          }
        });
        return;
      }

      // 축제명으로부터 축제 ID를 찾기
      const selectedFestivalIds = [];
      selectedFestivals.forEach(festivalName => {
        const festival = allFestivals.find(f =>
          (f.festivalNm === festivalName) || (f.name === festivalName)
        );
        if (festival) {
          selectedFestivalIds.push(festival.festivalId || festival.id);
        }
      });

      console.log('🏷️ 축제명에서 찾은 축제 ID들:', selectedFestivalIds);

      const data = await fetchFestivalDetails(selectedFestivalIds, selectedYears);

      if (data && data.length > 0) {
        console.log('📈 차트 생성 시작 - 데이터 개수:', data.length);

        // 총매출 차트
        const revenueConfig = prepareChartData(data, 'grossSales', '총 매출');
        console.log('💰 총매출 차트 설정:', revenueConfig);
        if (revenueConfig) createChart('revenue', revenueConfig);

        // 홍보강도 차트
        const promotionConfig = prepareChartData(data, 'promoIntensityIndex', '홍보강도 지수');
        console.log('📢 홍보강도 차트 설정:', promotionConfig);
        if (promotionConfig) createChart('promotion', promotionConfig);

        // 예산 차트
        const budgetConfig = prepareChartData(data, 'budgetKrw', '예산');
        console.log('💵 예산 차트 설정:', budgetConfig);
        if (budgetConfig) createChart('budget', budgetConfig);

        // 일 평균 방문객 차트
        const avgSpendConfig = prepareChartData(data, 'avgDailyVisitors', '일 평균 방문객');
        console.log('👥 일 평균 방문객 차트 설정:', avgSpendConfig);
        if (avgSpendConfig) createChart('lodging', avgSpendConfig);
      } else {
        console.log('❌ 데이터가 없거나 빈 배열입니다');
      }
    };

    updateCharts();

    // 컴포넌트 언마운트 시 차트 정리
    return () => {
      Object.values(chartRefs).forEach(ref => {
        if (ref.current) {
          ref.current.destroy();
        }
      });
    };
  }, [selectedFestivals, selectedYears, allFestivals, chartRefs, createChart, prepareChartData]);

  // 빈 상태 컴포넌트
  const EmptyChart = ({ title, unit }) => (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <span className="chart-unit">{unit}</span>
      </div>
      <div className="chart-container">
        <div className="chart-empty">
          <h4>축제를 선택해주세요</h4>
          <p>왼쪽 사이드바에서<br/>지역이나 카테고리를 선택하면<br/>해당 축제들의 차트가 표시됩니다.</p>
        </div>
      </div>
    </div>
  );

  // 선택된 축제가 있을 때만 차트를 표시
  const isDataAvailable = selectedFestivals && selectedFestivals.length > 0;

  return (
    <div className="chart-only-panel">
      <div className="chart-grid">
        {/* 1행 1열 - 총매출 차트 */}
        {isDataAvailable ? (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                총 매출
                <div 
                  className="chart-info-icon" 
                  ref={iconRefs.revenue}
                  onMouseEnter={() => handleTooltipShow('revenue')}
                  onMouseLeave={() => handleTooltipHide('revenue')}
                  title="차트 정보"
                >
                  <span className="info-icon">i</span>
                </div>
              </h3>
              <span className="chart-unit">(백만원)</span>
            </div>
            <div className="chart-container">
              <canvas id="revenue"></canvas>
            </div>
          </div>
        ) : (
          <EmptyChart title="총 매출" unit="(백만원)" />
        )}

        {/* 1행 2열 - 홍보강도 차트 */}
        {isDataAvailable ? (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                홍보량
                <div 
                  className="chart-info-icon" 
                  ref={iconRefs.promotion}
                  onMouseEnter={() => handleTooltipShow('promotion')}
                  onMouseLeave={() => handleTooltipHide('promotion')}
                  title="차트 정보"
                >
                  <span className="info-icon">i</span>
                </div>
              </h3>
              <span className="chart-unit">(건)</span>
            </div>
            <div className="chart-container">
              <canvas id="promotion"></canvas>
            </div>
          </div>
        ) : (
          <EmptyChart title="홍보량" unit="(건)" />
        )}

        {/* 2행 1열 - 예산 차트 */}
        {isDataAvailable ? (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                예산
                <div 
                  className="chart-info-icon" 
                  ref={iconRefs.budget}
                  onMouseEnter={() => handleTooltipShow('budget')}
                  onMouseLeave={() => handleTooltipHide('budget')}
                  title="차트 정보"
                >
                  <span className="info-icon">i</span>
                </div>
              </h3>
              <span className="chart-unit">(백만원)</span>
            </div>
            <div className="chart-container">
              <canvas id="budget"></canvas>
            </div>
          </div>
        ) : (
          <EmptyChart title="예산" unit="(백만원)" />
        )}

        {/* 2행 2열 - 일 평균 방문객 차트 */}
        {isDataAvailable ? (
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">
                일 평균 방문객
                <div 
                  className="chart-info-icon" 
                  ref={iconRefs.lodging}
                  onMouseEnter={() => handleTooltipShow('lodging')}
                  onMouseLeave={() => handleTooltipHide('lodging')}
                  title="차트 정보"
                >
                  <span className="info-icon">i</span>
                </div>
              </h3>
              <span className="chart-unit">(명)</span>
            </div>
            <div className="chart-container">
              <canvas id="lodging"></canvas>
            </div>
          </div>
        ) : (
          <EmptyChart title="일 평균 방문객" unit="(명)" />
        )}
      </div>

      {/* 툴팁들 */}
      {showTooltip.revenue && (
        <div 
          className="info-tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          <div className="tooltip-content">
            <h4>차트 정보</h4>
            <p><strong>바 차트:</strong> 단일 연도에서 여러 축제의 매출을 비교</p>
            <p><strong>선 차트:</strong> 여러 연도에 걸친 매출 변화 추이</p>
            <p><strong>마우스 오버:</strong> 정확한 수치 확인 가능</p>
            
            {/* 선택된 축제 정보 */}
            {selectedFestivals.length > 0 && (
              <>
                <hr className="tooltip-divider" />
                <p><strong>선택된 축제:</strong></p>
                <ul className="selected-festivals-list">
                  {selectedFestivals.map((festival, index) => {
                    console.log('Festival data:', festival, 'Index:', index);
                    // 축제가 객체인지 ID인지 확인
                    if (typeof festival === 'object') {
                      return (
                        <li key={festival.festivalId || festival.id || index}>
                          축제 ID: {festival.festivalNm || festival.name || 'Unknown'}
                        </li>
                      );
                    } else {
                      // ID인 경우 allFestivals에서 찾기
                      const festivalData = allFestivals.find(f => f.id === festival || f.festivalId === festival);
                      return (
                        <li key={festival}>
                          {festivalData ? festivalData.name || festivalData.festivalNm : `축제 ID: ${festival}`}
                        </li>
                      );
                    }
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {showTooltip.promotion && (
        <div 
          className="info-tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          <div className="tooltip-content">
            <h4>차트 정보</h4>
            <p><strong>홍보량 지수:</strong> 해당 축제가 온라인에서 얼마나 화제가 되고 있는지를 다른 축제들과 비교하여 0~100점으로 나타낸 상대적 인기도 지표입니다.</p>
            <p><strong>계산 공식:</strong></p>
            <p style={{fontFamily: 'monospace', fontSize: '12px', margin: '4px 0', padding: '4px 8px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>
              홍보량 지수ᵢ = (Σₜ 검색량ᵢₜ / max(Σₜ 검색량ⱼₜ)) × 100
            </p>
            <p style={{fontSize: '11px', color: '#666', margin: '2px 0'}}>
              i = 특정 축제, j = 모든 축제, t = 시간(일/주/월)
            </p>
            <p><strong>바 차트:</strong> 단일 연도에서 여러 축제의 홍보 강도를 비교</p>
            <p><strong>선 차트:</strong> 여러 연도에 걸친 홍보 강도 변화 추이</p>
            <p><strong>마우스 오버:</strong> 정확한 수치 확인 가능</p>
            
            {/* 선택된 축제 정보 */}
            {selectedFestivals.length > 0 && (
              <>
                <hr className="tooltip-divider" />
                <p><strong>선택된 축제:</strong></p>
                <ul className="selected-festivals-list">
                  {selectedFestivals.map((festival, index) => {
                    console.log('Festival data:', festival, 'Index:', index);
                    // 축제가 객체인지 ID인지 확인
                    if (typeof festival === 'object') {
                      return (
                        <li key={festival.festivalId || festival.id || index}>
                          축제 ID: {festival.festivalNm || festival.name || 'Unknown'}
                        </li>
                      );
                    } else {
                      // ID인 경우 allFestivals에서 찾기
                      const festivalData = allFestivals.find(f => f.id === festival || f.festivalId === festival);
                      return (
                        <li key={festival}>
                          {festivalData ? festivalData.name || festivalData.festivalNm : `축제 ID: ${festival}`}
                        </li>
                      );
                    }
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {showTooltip.budget && (
        <div 
          className="info-tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          <div className="tooltip-content">
            <h4>차트 정보</h4>
            <p><strong>바 차트:</strong> 단일 연도에서 여러 축제의 예산을 비교</p>
            <p><strong>선 차트:</strong> 여러 연도에 걸친 예산 변화 추이</p>
            <p><strong>마우스 오버:</strong> 정확한 수치 확인 가능</p>
            
            {/* 선택된 축제 정보 */}
            {selectedFestivals.length > 0 && (
              <>
                <hr className="tooltip-divider" />
                <p><strong>선택된 축제:</strong></p>
                <ul className="selected-festivals-list">
                  {selectedFestivals.map((festival, index) => {
                    console.log('Festival data:', festival, 'Index:', index);
                    // 축제가 객체인지 ID인지 확인
                    if (typeof festival === 'object') {
                      return (
                        <li key={festival.festivalId || festival.id || index}>
                          축제 ID: {festival.festivalNm || festival.name || 'Unknown'}
                        </li>
                      );
                    } else {
                      // ID인 경우 allFestivals에서 찾기
                      const festivalData = allFestivals.find(f => f.id === festival || f.festivalId === festival);
                      return (
                        <li key={festival}>
                          {festivalData ? festivalData.name || festivalData.festivalNm : `축제 ID: ${festival}`}
                        </li>
                      );
                    }
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {showTooltip.lodging && (
        <div 
          className="info-tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          <div className="tooltip-content">
            <h4>차트 정보</h4>
            <p><strong>바 차트:</strong> 단일 연도에서 여러 축제의 일 평균 방문객을 비교</p>
            <p><strong>선 차트:</strong> 여러 연도에 걸친 일 평균 방문객 변화 추이</p>
            <p><strong>마우스 오버:</strong> 정확한 수치 확인 가능</p>
            
            {/* 선택된 축제 정보 */}
            {selectedFestivals.length > 0 && (
              <>
                <hr className="tooltip-divider" />
                <p><strong>선택된 축제:</strong></p>
                <ul className="selected-festivals-list">
                  {selectedFestivals.map((festival, index) => {
                    console.log('Festival data:', festival, 'Index:', index);
                    // 축제가 객체인지 ID인지 확인
                    if (typeof festival === 'object') {
                      return (
                        <li key={festival.festivalId || festival.id || index}>
                          축제 ID: {festival.festivalNm || festival.name || 'Unknown'}
                        </li>
                      );
                    } else {
                      // ID인 경우 allFestivals에서 찾기
                      const festivalData = allFestivals.find(f => f.id === festival || f.festivalId === festival);
                      return (
                        <li key={festival}>
                          {festivalData ? festivalData.name || festivalData.festivalNm : `축제 ID: ${festival}`}
                        </li>
                      );
                    }
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartOnlyPanel;