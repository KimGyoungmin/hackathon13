/**
 * 통계 데이터 관련 API 서비스
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * 선택된 축제들의 상세 통계 데이터를 가져오는 함수
 * @param {Array} festivalNames - 선택된 축제 이름들
 * @param {Array} years - 선택된 년도들
 * @returns {Promise<Object>} 통계 데이터
 */
export const getFestivalStatistics = async (festivalNames = [], years = [2024]) => {
  try {
    // 축제명과 년도를 쿼리 파라미터로 전달
    const params = new URLSearchParams();

    festivalNames.forEach(name => {
      params.append('festivalNames', name);
    });

    years.forEach(year => {
      params.append('years', year);
    });

    console.log('API 호출:', `${API_BASE_URL}/festivals/statistics?${params}`);

    const response = await fetch(`${API_BASE_URL}/festivals/statistics?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('실제 데이터 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('축제 통계 데이터 조회 실패:', error);

    // 에러 발생 시 샘플 데이터 반환
    console.log('샘플 데이터로 fallback');
    return generateSampleStatistics(festivalNames, years);
  }
};

/**
 * 축제별 년도별 상세 데이터를 가져오는 함수
 * @param {Array} festivalNames - 선택된 축제 이름들
 * @param {Array} years - 선택된 년도들
 * @returns {Promise<Array>} 축제별 년도별 데이터 배열
 */
export const getFestivalDetailData = async (festivalNames = [], years = [2024]) => {
  try {
    const params = new URLSearchParams();

    festivalNames.forEach(name => {
      params.append('festivalNames', name);
    });

    years.forEach(year => {
      params.append('years', year);
    });

    console.log('상세 데이터 API 호출:', `${API_BASE_URL}/festivals/details?${params}`);

    const response = await fetch(`${API_BASE_URL}/festivals/details?${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('실제 상세 데이터 조회 성공:', data);

    // API 응답 데이터를 프론트엔드 형식에 맞게 변환
    const formattedData = data.map(item => ({
      festivalName: item.festivalName,
      year: item.year,
      totalVisitors: item.totalVisitors || 0,
      grossSales: item.grossSales || 0,
      avgDailyVisitors: item.avgDailyVisitors || 0,
      budgetKrw: item.budgetKrw || 0
    }));

    return formattedData;
  } catch (error) {
    console.error('축제 상세 데이터 조회 실패:', error);

    // 에러 발생 시 샘플 데이터 반환
    console.log('샘플 데이터로 fallback');
    return generateSampleDetailData(festivalNames, years);
  }
};

/**
 * 샘플 통계 데이터 생성 함수 (API 연결 전 테스트용)
 */
const generateSampleStatistics = (festivalNames, years) => {
  const festivalCount = festivalNames.length || 1;
  const yearCount = years.length || 1;

  // 기본 방문객 수와 매출 (축제당, 년도당)
  const baseVisitors = 50000;
  const baseSales = 8000000000; // 80억원

  // 랜덤 변수 추가
  const randomMultiplier = () => 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2

  const totalVisitors = Math.round(festivalCount * yearCount * baseVisitors * randomMultiplier());
  const totalSales = Math.round(festivalCount * yearCount * baseSales * randomMultiplier());

  return {
    totalVisitors,
    avgVisitors: festivalCount > 0 ? Math.round(totalVisitors / festivalCount) : 0,
    totalSales,
    avgSales: festivalCount > 0 ? Math.round(totalSales / festivalCount) : 0,
    festivalCount,
    yearCount
  };
};

/**
 * 샘플 상세 데이터 생성 함수 (차트용)
 */
const generateSampleDetailData = (festivalNames, years) => {
  const data = [];

  festivalNames.forEach((festivalName, festivalIndex) => {
    years.forEach(year => {
      // 각 축제별, 년도별로 다른 데이터 생성
      const baseVisitors = 30000 + (festivalIndex * 10000);
      const baseSales = 5000000000 + (festivalIndex * 2000000000);

      // 년도별 트렌드 반영
      const yearTrend = year <= 2020 ? 0.9 : year >= 2023 ? 1.1 : 1.0;
      const randomFactor = 0.8 + Math.random() * 0.4;

      data.push({
        festivalName,
        year,
        totalVisitors: Math.round(baseVisitors * yearTrend * randomFactor),
        grossSales: Math.round(baseSales * yearTrend * randomFactor),
        avgDailyVisitors: Math.round((baseVisitors * yearTrend * randomFactor) / 7), // 7일 축제 가정
        budgetKrw: Math.round(baseSales * 0.3 * yearTrend * randomFactor) // 예산은 매출의 30% 가정
      });
    });
  });

  return data;
};

/**
 * 차트 데이터 형식으로 변환하는 함수
 * @param {Array} detailData - 상세 데이터 배열
 * @param {String} chartType - 차트 타입 ('bar' 또는 'line')
 * @returns {Object} Chart.js 형식의 데이터
 */
export const formatChartData = (detailData, chartType) => {
  if (chartType === 'bar') {
    // 바 차트: 축제별 방문객 수
    const festivalGroups = detailData.reduce((acc, item) => {
      if (!acc[item.festivalName]) {
        acc[item.festivalName] = [];
      }
      acc[item.festivalName].push(item);
      return acc;
    }, {});

    const labels = Object.keys(festivalGroups);
    const visitors = labels.map(festival => {
      const festivalData = festivalGroups[festival];
      return festivalData.reduce((sum, item) => sum + item.totalVisitors, 0) / festivalData.length;
    });

    return {
      labels,
      datasets: [{
        label: '평균 방문객 수 (명)',
        data: visitors,
        backgroundColor: [
          'rgba(169, 68, 66, 0.8)',
          'rgba(70, 130, 180, 0.8)',
          'rgba(60, 179, 113, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(169, 68, 66, 1)',
          'rgba(70, 130, 180, 1)',
          'rgba(60, 179, 113, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      }]
    };
  } else {
    // 선 차트: 년도별 추이
    const years = [...new Set(detailData.map(item => item.year))].sort();
    const festivals = [...new Set(detailData.map(item => item.festivalName))];

    const datasets = festivals.map((festival, index) => {
      const festivalData = detailData.filter(item => item.festivalName === festival);
      const yearlyData = years.map(year => {
        const yearData = festivalData.find(item => item.year === year);
        return yearData ? yearData.totalVisitors : 0;
      });

      return {
        label: festival,
        data: yearlyData,
        borderColor: [
          'rgba(169, 68, 66, 1)',
          'rgba(70, 130, 180, 1)',
          'rgba(60, 179, 113, 1)',
          'rgba(255, 159, 64, 1)',
        ][index % 4],
        backgroundColor: [
          'rgba(169, 68, 66, 0.2)',
          'rgba(70, 130, 180, 0.2)',
          'rgba(60, 179, 113, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ][index % 4],
        tension: 0.1,
        fill: false, // 차트만과 동일하게 fill 비활성화
        // 포인트 설정 (Chart.js 기본값과 동일하게)
        pointRadius: 4,
        pointHoverRadius: 8,
        pointHitRadius: 25
      };
    });

    return {
      labels: years.map(year => `${year}년`),
      datasets
    };
  }
};