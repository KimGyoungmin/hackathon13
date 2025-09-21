/**
 * 차트 데이터 관리를 위한 커스텀 훅
 * PRD의 상태 관리 구조에 맞춰 구현
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../contexts/AppContext.jsx';
import festivalService from '../services/festivalService.js';
import { useApi, getErrorMessage } from './useApi.js';

/**
 * 차트 데이터 관리 훅
 * @returns {Object} 차트 관련 상태와 함수들
 */
export const useChartData = () => {
  const { state, actions } = useApp();
  const {
    selectedFestival,
    festivalDetail,
    chartData,
    selectedYears,
    chartType,
    chartLoading,
    error
  } = state;

  // API 훅들
  const detailApi = useApi(festivalService.getFestivalById);
  const statsApi = useApi(festivalService.getYearlyStats);

  // 축제 상세 정보 로딩
  const loadFestivalDetail = useCallback(async (festivalId) => {
    if (!festivalId) return;

    try {
      actions.setLoading(true);
      const detail = await detailApi.execute(festivalId);
      actions.setFestivalDetail(detail);
      return detail;
    } catch (error) {
      console.error('축제 상세 정보 로딩 실패:', error);
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
      return null;
    } finally {
      actions.setLoading(false);
    }
  }, [actions, detailApi]);

  // 연도별 통계 로딩
  const loadYearlyStats = useCallback(async (festivalId, years = selectedYears) => {
    if (!festivalId) return;

    try {
      actions.setChartLoading(true);
      const stats = await statsApi.execute(festivalId, years);
      actions.setChartData(stats);
      return stats;
    } catch (error) {
      console.error('연도별 통계 로딩 실패:', error);
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
      return null;
    } finally {
      actions.setChartLoading(false);
    }
  }, [actions, statsApi, selectedYears]);

  // 축제 선택 시 상세 정보와 통계 로딩
  const selectFestival = useCallback(async (festival) => {
    if (!festival) return;

    actions.setSelectedFestival(festival);
    
    // 상세 정보와 통계를 병렬로 로딩
    await Promise.all([
      loadFestivalDetail(festival.id),
      loadYearlyStats(festival.id)
    ]);
  }, [actions, loadFestivalDetail, loadYearlyStats]);

  // 연도 변경 시 통계 재로딩
  useEffect(() => {
    if (selectedFestival && selectedYears.length > 0) {
      loadYearlyStats(selectedFestival.id, selectedYears);
    }
  }, [selectedYears, selectedFestival, loadYearlyStats]);

  // 차트 데이터 포맷팅
  const formattedChartData = useMemo(() => {
    if (!chartData?.yearlyData) {
      return {
        labels: ['2022', '2023', '2024'],
        datasets: [
          {
            label: selectedFestival?.name || '축제',
            data: [65000, 52000, 82000],
            borderColor: 'rgb(45, 80, 22)',
            backgroundColor: 'rgba(45, 80, 22, 0.2)',
            tension: 0.1
          }
        ]
      };
    }

    return {
      labels: chartData.yearlyData.map(item => item.year.toString()),
      datasets: [
        {
          label: selectedFestival?.name || '축제',
          data: chartData.yearlyData.map(item => item.visitors),
          borderColor: 'rgb(45, 80, 22)',
          backgroundColor: 'rgba(45, 80, 22, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [chartData, selectedFestival]);

  // 수익 차트 데이터
  const revenueChartData = useMemo(() => {
    if (!chartData?.yearlyData) {
      return {
        labels: ['2022', '2023', '2024'],
        datasets: [
          {
            label: '수익 (백만원)',
            data: [980, 785, 1250],
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            tension: 0.1
          }
        ]
      };
    }

    return {
      labels: chartData.yearlyData.map(item => item.year.toString()),
      datasets: [
        {
          label: '수익 (백만원)',
          data: chartData.yearlyData.map(item => Math.round(item.revenue / 1000000)),
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          tension: 0.1
        }
      ]
    };
  }, [chartData]);

  // 통합 차트 데이터 (방문객 + 수익)
  const combinedChartData = useMemo(() => {
    if (!chartData?.yearlyData) {
      return {
        labels: ['2022', '2023', '2024'],
        datasets: [
          {
            label: '방문객 수',
            data: [65000, 52000, 82000],
            borderColor: 'rgb(45, 80, 22)',
            backgroundColor: 'rgba(45, 80, 22, 0.2)',
            tension: 0.1,
            yAxisID: 'y'
          },
          {
            label: '수익 (백만원)',
            data: [980, 785, 1250],
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            tension: 0.1,
            yAxisID: 'y1'
          }
        ]
      };
    }

    return {
      labels: chartData.yearlyData.map(item => item.year.toString()),
      datasets: [
        {
          label: '방문객 수',
          data: chartData.yearlyData.map(item => item.visitors),
          borderColor: 'rgb(45, 80, 22)',
          backgroundColor: 'rgba(45, 80, 22, 0.2)',
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: '수익 (백만원)',
          data: chartData.yearlyData.map(item => Math.round(item.revenue / 1000000)),
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    };
  }, [chartData]);

  // 차트 옵션
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedFestival ? `${selectedFestival.name} 연도별 통계` : '축제를 선택해주세요',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '방문객 수',
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: '수익 (백만원)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }), [selectedFestival]);

  // 통계 요약
  const statsSummary = useMemo(() => {
    if (!chartData?.yearlyData || chartData.yearlyData.length === 0) {
      return {
        totalVisitors: 0,
        averageVisitors: 0,
        totalRevenue: 0,
        averageRevenue: 0,
        growthRate: 0,
        bestYear: null,
        worstYear: null
      };
    }

    const data = chartData.yearlyData;
    const totalVisitors = data.reduce((sum, item) => sum + item.visitors, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const averageVisitors = Math.round(totalVisitors / data.length);
    const averageRevenue = Math.round(totalRevenue / data.length);

    // 성장률 계산 (첫 해 대비 마지막 해)
    const firstYear = data[0];
    const lastYear = data[data.length - 1];
    const growthRate = firstYear ? 
      Math.round(((lastYear.visitors - firstYear.visitors) / firstYear.visitors) * 100) : 0;

    // 최고/최저 연도
    const bestYear = data.reduce((best, current) => 
      current.visitors > best.visitors ? current : best
    );
    const worstYear = data.reduce((worst, current) => 
      current.visitors < worst.visitors ? current : worst
    );

    return {
      totalVisitors,
      averageVisitors,
      totalRevenue,
      averageRevenue,
      growthRate,
      bestYear,
      worstYear
    };
  }, [chartData]);

  // 차트 액션들
  const chartActions = useMemo(() => ({
    selectFestival,
    setChartType: (type) => actions.setChartType(type),
    refreshChartData: () => {
      if (selectedFestival) {
        loadYearlyStats(selectedFestival.id);
      }
    },
    clearChartData: () => {
      actions.setChartData(null);
      actions.setSelectedFestival(null);
      actions.setFestivalDetail(null);
    }
  }), [actions, selectFestival, loadYearlyStats, selectedFestival]);

  return {
    // 상태
    selectedFestival,
    festivalDetail,
    chartData,
    chartType,
    loading: chartLoading,
    error,

    // 차트 데이터
    formattedChartData,
    revenueChartData,
    combinedChartData,
    chartOptions,

    // 통계 요약
    statsSummary,

    // 액션
    ...chartActions,

    // API 상태
    detailLoading: detailApi.loading,
    statsLoading: statsApi.loading,
    detailError: detailApi.error,
    statsError: statsApi.error
  };
};

/**
 * 특정 축제의 상세 정보만을 관리하는 훅
 * @param {number} festivalId - 축제 ID
 * @returns {Object} 축제 상세 정보와 상태
 */
export const useFestivalDetail = (festivalId) => {
  const { state, actions } = useApp();
  const detailApi = useApi(festivalService.getFestivalById);

  const loadDetail = useCallback(async () => {
    if (!festivalId) return;

    try {
      actions.setLoading(true);
      const detail = await detailApi.execute(festivalId);
      actions.setFestivalDetail(detail);
      return detail;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
      return null;
    } finally {
      actions.setLoading(false);
    }
  }, [festivalId, actions, detailApi]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  return {
    festivalDetail: detailApi.data || state.festivalDetail,
    loading: detailApi.loading,
    error: detailApi.error,
    refresh: loadDetail
  };
};

/**
 * 특정 축제의 연도별 통계만을 관리하는 훅
 * @param {number} festivalId - 축제 ID
 * @param {Array<string>} years - 연도 배열
 * @returns {Object} 연도별 통계와 상태
 */
export const useYearlyStats = (festivalId, years = []) => {
  const { state, actions } = useApp();
  const statsApi = useApi(festivalService.getYearlyStats);

  const loadStats = useCallback(async () => {
    if (!festivalId) return;

    try {
      actions.setChartLoading(true);
      const stats = await statsApi.execute(festivalId, years);
      return stats;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      actions.setError(errorMessage);
      return null;
    } finally {
      actions.setChartLoading(false);
    }
  }, [festivalId, years, actions, statsApi]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    yearlyStats: statsApi.data || state.chartData,
    loading: statsApi.loading,
    error: statsApi.error,
    refresh: loadStats
  };
};

export default useChartData;
