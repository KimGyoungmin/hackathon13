import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext.jsx';
import { useChartData } from '../../hooks/useChartData.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './ChartPanel.css';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartPanel = () => {
  const { state, actions } = useApp();
  const { selectedYears } = state;
  
  const {
    selectedFestival,
    festivalDetail,
    formattedChartData,
    chartType,
    loading: chartLoading,
    selectFestival,
    setChartType
  } = useChartData();

  const [selectedYear, setSelectedYear] = useState('2024');

  // 연도 선택 핸들러
  const handleYearChange = (year) => {
    setSelectedYear(year);
    // API 호출 로직 (추후 구현)
    console.log(`Selected year: ${year}`);
  };

  // 차트 타입 변경 핸들러
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  // 차트 옵션
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString() + '명';
          }
        }
      }
    }
  };

  return (
    <div className="chart-panel">
      {/* 연도 선택 */}
      <div className="chart-header">
        <div className="year-selector">
          <label htmlFor="year-select">연도 선택</label>
          <select
            id="year-select"
            className="input"
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
          >
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* 선택된 축제 정보 카드 */}
      {selectedFestival && (
        <div className="festival-info-card">
          <div className="festival-icon">
            <span>🎪</span>
          </div>
          <div className="festival-details">
            <h3>{selectedFestival.name}</h3>
            <div className="festival-meta">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>위치: {selectedFestival.location?.name || selectedFestival.region || '알 수 없음'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🏷️</span>
                <span>카테고리: {selectedFestival.category?.name || selectedFestival.category || '알 수 없음'}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>기간: 9월 15일 ~ 9월 18일</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 방문객 수 차트 */}
      <div className="chart-section">
        <div className="chart-header">
          <h3>방문객 수 차트 (명)</h3>
          <div className="chart-type-controls">
            <button
              className={`btn ${chartType === 'line' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleChartTypeChange('line')}
            >
              선차트
            </button>
            <button
              className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleChartTypeChange('bar')}
            >
              막대차트
            </button>
          </div>
        </div>

        <div className="chart-container">
          {chartLoading ? (
            <div className="chart-loading">
              <div className="loading-spinner"></div>
              <p>차트 로딩 중...</p>
            </div>
              ) : (
                <>
                  {chartType === 'line' ? (
                    <Line data={formattedChartData} options={chartOptions} />
                  ) : (
                    <Bar data={formattedChartData} options={chartOptions} />
                  )}
                </>
              )}
        </div>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">8.2만명</div>
            <div className="stat-label">총 방문객 수</div>
          </div>
          <div className="stat-indicator red"></div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">8.2만명</div>
            <div className="stat-label">평균 방문객 수</div>
          </div>
          <div className="stat-indicator red"></div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">12.5억원</div>
            <div className="stat-label">총 매출</div>
          </div>
          <div className="stat-indicator red"></div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">12.5억원</div>
            <div className="stat-label">평균 매출</div>
          </div>
          <div className="stat-indicator red"></div>
        </div>
      </div>

      {/* 범례 */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color red"></div>
          <span>나주배축제</span>
        </div>
        <div className="legend-item">
          <div className="legend-color green"></div>
          <span>진도 어리향축제</span>
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
