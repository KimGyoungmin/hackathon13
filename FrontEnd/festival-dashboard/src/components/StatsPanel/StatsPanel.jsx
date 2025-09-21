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
import React, { useState, useMemo, useEffect } from 'react';
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
          labels: years.map(year => `${year}년`),
          datasets: [{
            label: '선택된 축제 없음',
            data: years.map(() => 0),
            borderColor: 'rgba(128, 128, 128, 1)',
            backgroundColor: 'rgba(128, 128, 128, 0.2)',
            tension: 0.1,
          }]
        };
      }
    }

    // 실제 데이터로 차트 생성
    return formatChartData(chartDetailData, chartType);
  }, [chartType, chartDetailData, selectedFestivals, years]);

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1.8, // 차트의 가로:세로 비율 (1.8:1) - 더 세로로 넓게
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 10,
          font: {
            size: 13,
          },
        },
      },
      title: {
        display: true,
        text: '방문객 수 차트 (명)',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
    },
    layout: {
      padding: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5,
      },
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
          padding: 10,
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          padding: 8,
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: chartType === 'bar' ? '축제명' : '년도',
          font: {
            size: 13,
            weight: 'bold',
          },
          padding: 10,
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
          {isLoading ? (
            <div className="chart-loading">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            chartType === 'bar' ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <Line data={chartData} options={chartOptions} />
            )
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