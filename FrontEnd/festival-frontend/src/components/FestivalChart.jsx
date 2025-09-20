import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * 축제 데이터 차트 컴포넌트
 * 지역별 축제 수와 년도별 분포를 보여줍니다.
 */
const FestivalChart = ({ festivals = [], selectedLocationName = '' }) => {
  
  // 년도별 축제 수 계산
  const yearData = festivals.reduce((acc, festival) => {
    if (festival.year) {
      acc[festival.year] = (acc[festival.year] || 0) + 1;
    }
    return acc;
  }, {});

  // 카테고리별 축제 수 계산
  const categoryData = festivals.reduce((acc, festival) => {
    const categoryNames = {
      1: '문화/역사',
      2: '음식/미식', 
      3: '자연/계절',
      4: '체험/레저',
      5: '일반/기타'
    };
    const categoryName = categoryNames[festival.categoryId] || `카테고리 ${festival.categoryId}`;
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {});

  // 년도별 차트 데이터
  const yearChartData = {
    labels: Object.keys(yearData).sort(),
    datasets: [
      {
        label: '축제 수',
        data: Object.keys(yearData).sort().map(year => yearData[year]),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 카테고리별 차트 데이터
  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: '축제 수',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(251, 191, 36, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedLocationName ? `${selectedLocationName} 축제 분석` : '축제 데이터 분석',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (festivals.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#6b7280'
      }}>
        <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📊</div>
        <p>표시할 데이터가 없습니다.</p>
        <p>지역을 선택해보세요.</p>
      </div>
    );
  }

  return (
    <div style={{padding: '1rem'}}>
      <div style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}>
        {/* 년도별 차트 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            년도별 축제 분포
          </h3>
          <Bar data={yearChartData} options={options} />
        </div>

        {/* 카테고리별 차트 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            카테고리별 축제 분포
          </h3>
          <Bar data={categoryChartData} options={options} />
        </div>
      </div>

      {/* 통계 요약 */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
      }}>
        <div style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6'}}>
            {festivals.length}
          </div>
          <div style={{color: '#6b7280'}}>총 축제 수</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#9333ea'}}>
            {Object.keys(yearData).length}
          </div>
          <div style={{color: '#6b7280'}}>활동 년도</div>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          padding: '1rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#22c55e'}}>
            {Object.keys(categoryData).length}
          </div>
          <div style={{color: '#6b7280'}}>활동 카테고리</div>
        </div>
      </div>
    </div>
  );
};

export default FestivalChart;
