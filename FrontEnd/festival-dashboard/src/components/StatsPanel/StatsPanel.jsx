/**
 * StatsPanel 컴포넌트
 *
 * 역할: 오른쪽 사이드바의 통계 패널
 * - 선택된 축제와 년도에 따른 차트 표시
 * - 통계 카드 4개 표시 (총 매출액, 평균 매출액, 총 매출, 평균 매출)
 *
 * 차트 규칙:
 * - 단일축제+단일년도, 다중축제+단일년도: 바 차트
 * - 단일축제+다중년도, 다중축제+다중년도: 선 차트
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getFestivalStatistics, getFestivalDetailData, formatChartData } from '../../services/statisticsService';
import './styles/StatsPanel.css';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const StatsPanel = ({
  selectedFestivals = [],
  selectedYears = [2024], // 기본값으로 2024년 설정
  setSelectedYears = () => {}, // 년도 변경 함수
  allFestivals = []
}) => {
  // 년도 선택 상태는 상위 컴포넌트에서 관리
  const years = selectedYears;

  // 사용 가능한 년도 범위 (2017~2024)
  const availableYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  // 통계 데이터 상태
  const [statsData, setStatsData] = useState({
    totalVisitors: 0,
    avgVisitors: 0,
    totalSales: 0,
    avgSales: 0
  });

  // 차트 데이터 상태
  const [chartDetailData, setChartDetailData] = useState([]);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 툴팁 상태
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);

  // 차트 타입 결정
  const chartType = useMemo(() => {
    const festivalCount = selectedFestivals.length;
    const yearCount = years.length;

    // 단일축제+단일년도 또는 다중축제+단일년도 → 바 차트
    if (yearCount === 1) {
      return 'bar';
    }
    // 나머지 케이스 → 선 차트
    return 'line';
  }, [selectedFestivals.length, years.length]);

  // 데이터 로딩 함수
  const loadData = async () => {
    if (selectedFestivals.length === 0) {
      setStatsData({
        totalVisitors: 0,
        avgVisitors: 0,
        totalSales: 0,
        avgSales: 0
      });
      setChartDetailData([]);
      return;
    }

    setIsLoading(true);
    try {
      // 통계 데이터와 상세 데이터를 병렬로 가져오기
      const [statistics, detailData] = await Promise.all([
        getFestivalStatistics(selectedFestivals, years),
        getFestivalDetailData(selectedFestivals, years)
      ]);

      setStatsData(statistics);
      setChartDetailData(detailData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 선택된 축제나 년도가 변경될 때마다 데이터 다시 로드
  useEffect(() => {
    loadData();
  }, [selectedFestivals, years]);

  // 차트 데이터 생성
  const chartData = useMemo(() => {
    console.log('차트 데이터 생성:', { chartDetailData, selectedFestivals, years, chartType });
    
    if (chartDetailData.length === 0 || selectedFestivals.length === 0) {
      // 데이터가 없을 때 기본 차트
      if (chartType === 'bar') {
        return {
          labels: ['선택된 축제 없음'],
          datasets: [{
            label: '방문객 수 (명)',
            data: [0],
            backgroundColor: 'rgba(128, 128, 128, 0.5)',
            borderColor: 'rgba(128, 128, 128, 1)',
            borderWidth: 1,
          }]
        };
      } else {
        return {
          labels: years.length > 0 ? years.map(year => `${year}년`) : ['2024년'],
          datasets: [{
            label: '선택된 축제 없음',
            data: years.length > 0 ? years.map(() => 0) : [0],
            borderColor: 'rgba(128, 128, 128, 1)',
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
            tension: 0.1,
            pointRadius: 4,
            pointHoverRadius: 6,
          }]
        };
      }
    }

    // 실제 데이터로 차트 생성
    const formattedData = formatChartData(chartDetailData, chartType);
    console.log('포맷된 차트 데이터:', formattedData);
    return formattedData;
  }, [chartType, chartDetailData, selectedFestivals, years]);

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // 범례 완전히 숨김
      },
      title: {
        display: false, // 커스텀 헤더로 제목 표시하므로 차트 내 제목 숨김
      },
      tooltip: {
        enabled: true,
        mode: 'nearest', // 차트만과 동일하게 nearest 모드
        intersect: true, // 정확한 포인트 반응을 위해 true
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
            return `${dataset.label}: ${value.toLocaleString()}명`;
          }
        },
      },
    },
    layout: {
      padding: {
        top: 2,
        bottom: 2,
        left: 2,
        right: 2,
      },
    },
    // 포인트 반응 영역 설정 (차트만과 동일하게)
    elements: {
      point: {
        radius: 4,
        hoverRadius: 8,
        hitRadius: 25
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          },
          font: {
            size: 12,
          },
          padding: 8,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.08)',
          lineWidth: 1,
        },
        title: {
          display: true,
          text: '방문객 수 (명)',
          font: {
            size: 13,
            weight: 'bold',
          },
          padding: 5,
        },
      },
      x: {
        ticks: {
          display: false, // 모든 차트에서 X축 라벨 숨김
          font: {
            size: 11,
          },
          padding: 6,
        },
        grid: {
          display: false,
        },
        title: {
          display: false, // 모든 차트에서 X축 제목 숨김
          text: '년도',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 4,
        },
      },
    },
  };

  // 통계 데이터는 이제 state에서 관리

  // 년도 선택 핸들러 (상위 컴포넌트 상태 변경)
  const handleYearChange = (year) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year].sort()
    );
  };

  // 툴팁 위치 계산
  const updateTooltipPosition = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 10, // 아이콘 위쪽에 표시
        left: rect.right - 320 // 아이콘 오른쪽에서 툴팁 너비만큼 왼쪽으로
      });
    }
  };

  // 툴팁 표시/숨김 핸들러
  const handleTooltipShow = () => {
    updateTooltipPosition();
    setShowTooltip(true);
  };

  const handleTooltipHide = () => {
    setShowTooltip(false);
  };

  return (
    <div className="stats-panel">
      <div className="stats-panel__header">
        <h2>축제 통계 분석</h2>

        {/* 년도 선택 커스텀 드롭다운 */}
        <div className="year-selector">
          <span className="year-label">연도 선택:</span>
          <div className="custom-dropdown">
            <div className="dropdown-display">
              {years.length > 0 ? `${years.length}개 년도 선택됨` : '년도를 선택하세요'}
            </div>
            <div className="dropdown-options">
              {availableYears.map(year => (
                <div
                  key={year}
                  className={`dropdown-option ${years.includes(year) ? 'selected' : ''}`}
                  onClick={() => handleYearChange(year)}
                >
                  <span className="option-text">{year}년</span>
                  {years.includes(year) && <span className="option-check">✓</span>}
                </div>
              ))}
            </div>
            <div className="year-dropdown-hint">
              클릭으로 다중 선택/해제 가능
            </div>
          </div>
        </div>
      </div>

      <div className="stats-panel__content">
        {/* 차트 영역 */}
        <div className="chart-container">
          {/* 차트 제목과 정보 아이콘 */}
          <div className="chart-header">
            <h3 className="chart-title">
              방문객 수 차트 (명)
              <div 
                className="chart-info-icon" 
                ref={iconRef}
                onMouseEnter={handleTooltipShow}
                onMouseLeave={handleTooltipHide}
                title="차트 정보"
              >
                <span className="info-icon">i</span>
              </div>
            </h3>
          </div>
          
          {/* 툴팁 */}
          {showTooltip && (
            <div 
              className="info-tooltip"
              style={{
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`
              }}
            >
              <div className="tooltip-content">
                <h4>차트 정보</h4>
                <p><strong>바 차트:</strong> 단일 연도에서 여러 축제의 방문객 수를 비교</p>
                <p><strong>선 차트:</strong> 여러 연도에 걸친 방문객 수 변화 추이</p>
                <p><strong>마우스 오버:</strong> 정확한 수치 확인 가능</p>
                
                {/* 선택된 축제 정보 */}
                {selectedFestivals.length > 0 && (
                  <>
                    <hr className="tooltip-divider" />
                    <p><strong>선택된 축제:</strong></p>
                    <ul className="selected-festivals-list">
                      {selectedFestivals.map(festivalId => {
                        const festival = allFestivals.find(f => f.id === festivalId);
                        return (
                          <li key={festivalId}>
                            {festival ? festival.name : `축제 ID: ${festivalId}`}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
                
                {/* 선택된 연도 정보 */}
                {years.length > 0 && (
                  <>
                    <hr className="tooltip-divider" />
                    <p><strong>선택된 연도:</strong></p>
                    <ul className="selected-years-list">
                      {years.map(year => (
                        <li key={year}>{year}년</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="chart-loading">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {console.log('차트 렌더링:', { chartType, chartData, isLoading })}
              {chartType === 'bar' ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Line data={chartData} options={chartOptions} />
              )}
            </>
          )}
        </div>

        {/* 통계 카드 영역 */}
        <div className="stats-cards">
          <div className="stats-card">
            <div className="stats-card__value">
              {statsData.totalVisitors.toLocaleString()}명
            </div>
            <div className="stats-card__label">총 방문객 수</div>
          </div>

          <div className="stats-card">
            <div className="stats-card__value">
              {Math.round(statsData.avgVisitors).toLocaleString()}명
            </div>
            <div className="stats-card__label">평균 방문객 수</div>
          </div>

          <div className="stats-card">
            <div className="stats-card__value">
              {(statsData.totalSales / 100000000).toFixed(1)}억원
            </div>
            <div className="stats-card__label">총 매출액</div>
          </div>

          <div className="stats-card">
            <div className="stats-card__value">
              {(statsData.avgSales / 100000000).toFixed(1)}억원
            </div>
            <div className="stats-card__label">평균 매출액</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;