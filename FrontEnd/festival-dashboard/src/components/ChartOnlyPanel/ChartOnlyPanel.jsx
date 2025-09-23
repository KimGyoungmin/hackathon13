import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './ChartOnlyPanel.css';

const ChartOnlyPanel = ({ selectedFestivals, selectedYears, allFestivals }) => {
  const [chartData, setChartData] = useState({
    revenue: null,
    promotion: null,
    budget: null,
    lodging: null
  });

  // 차트 인스턴스를 저장할 ref
  const chartRefs = {
    revenue: React.useRef(null),
    promotion: React.useRef(null),
    budget: React.useRef(null),
    lodging: React.useRef(null)
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
  const getChartType = (festivalCount, yearCount) => {
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
  };

  // 차트 데이터 준비 함수
  const prepareChartData = (data, dataKey, label) => {
    if (!data || data.length === 0) return null;

    // 매출과 예산 데이터를 백만원 단위로 변환
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

        return {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label,
              data: chartData,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
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

        return {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label,
              data: chartData,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1
            }]
          }
        };
      }
    } else {
      // Line 차트 데이터 (단일축제+다중년도 또는 다중축제+다중년도)
      const datasets = festivalNames.map((festivalName, index) => {
        const festivalData = convertedData.filter(item => item.festivalName === festivalName);
        const dataPoints = years.map(year => {
          const yearData = festivalData.find(item => item.year === year);
          return yearData ? yearData[dataKey] || 0 : 0;
        });

        const colors = [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)'
        ];

        return {
          label: festivalName,
          data: dataPoints,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length].replace('1)', '0.1)'),
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
  };

  // 차트 생성/업데이트 함수
  const createChart = (canvasId, chartConfig) => {
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
                
                // 단위 설정
                if (canvasId === 'revenue' || canvasId === 'budget') {
                  unit = '백만원';
                } else if (canvasId === 'promotion') {
                  unit = '건';
                } else if (canvasId === 'lodging') {
                  unit = '%';
                }
                
                return `${dataset.label}: ${value.toLocaleString()}${unit}`;
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
                // 백만원 단위로 표시 (revenue, budget)
                if (canvasId === 'revenue' || canvasId === 'budget') {
                  return (value / 1000000).toLocaleString() + 'M';
                }
                return value.toLocaleString();
              }
            }
          }
        }
      }
    });
  };

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
        const revenueConfig = prepareChartData(data, 'grossSales', '총 매출 (백만원)');
        console.log('💰 총매출 차트 설정:', revenueConfig);
        if (revenueConfig) createChart('revenue', revenueConfig);

        // 홍보강도 차트
        const promotionConfig = prepareChartData(data, 'promoIntensityIndex', '홍보강도 지수');
        console.log('📢 홍보강도 차트 설정:', promotionConfig);
        if (promotionConfig) createChart('promotion', promotionConfig);

        // 예산 차트
        const budgetConfig = prepareChartData(data, 'budgetKrw', '예산 (백만원)');
        console.log('💵 예산 차트 설정:', budgetConfig);
        if (budgetConfig) createChart('budget', budgetConfig);

        // 체류숙박객수 차트는 데이터 준비중으로 공백 처리
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
  }, [selectedFestivals, selectedYears]);

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
              <h3>총 매출</h3>
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
              <h3>홍보량</h3>
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
              <h3>예산</h3>
              <span className="chart-unit">(백만원)</span>
            </div>
            <div className="chart-container">
              <canvas id="budget"></canvas>
            </div>
          </div>
        ) : (
          <EmptyChart title="예산" unit="(백만원)" />
        )}

        {/* 2행 2열 - 공백 (체류 숙박객 수 데이터 없음) */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>체류 숙박객 수</h3>
            <span className="chart-unit">(데이터 준비중)</span>
          </div>
          <div className="chart-container">
            <div className="chart-empty">
              <h4>데이터 준비중</h4>
              <p>해당 차트의 데이터는<br/>현재 준비중입니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartOnlyPanel;