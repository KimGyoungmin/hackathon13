/**
 * 축제 관련 API 서비스
 * PRD의 API 명세에 맞춰 구현된 축제 데이터 관련 함수들
 */

import { apiClient, ApiError } from './api.js';

/**
 * 필터 옵션 타입 정의
 * @typedef {Object} FilterOptions
 * @property {Array} regions - 지역 목록
 * @property {Array} categories - 카테고리 목록
 * @property {Array} years - 연도 목록
 */

/**
 * 축제 데이터 타입 정의
 * @typedef {Object} Festival
 * @property {number} id - 축제 ID
 * @property {string} name - 축제명
 * @property {string} region - 지역명
 * @property {string} category - 카테고리명
 * @property {number} latitude - 위도
 * @property {number} longitude - 경도
 * @property {number} totalVisitors - 총 방문객 수
 * @property {number} revenue - 총 수익
 */

/**
 * 축제 상세 정보 타입 정의
 * @typedef {Object} FestivalDetail
 * @property {number} id - 축제 ID
 * @property {string} name - 축제명
 * @property {string} region - 지역명
 * @property {string} category - 카테고리명
 * @property {Object} period - 기간 정보
 * @property {string} period.startDate - 시작일
 * @property {string} period.endDate - 종료일
 * @property {Object} stats - 통계 정보
 * @property {number} stats.totalVisitors - 총 방문객 수
 * @property {number} stats.averageVisitors - 평균 방문객 수
 * @property {number} stats.totalRevenue - 총 수익
 * @property {number} stats.growthRate - 성장률
 */

/**
 * 연도별 통계 타입 정의
 * @typedef {Object} YearlyStats
 * @property {number} festivalId - 축제 ID
 * @property {Array} yearlyData - 연도별 데이터
 * @property {number} yearlyData[].year - 연도
 * @property {number} yearlyData[].visitors - 방문객 수
 * @property {number} yearlyData[].revenue - 수익
 */

/**
 * 필터 파라미터 타입 정의
 * @typedef {Object} FestivalFilters
 * @property {Array<number>} regions - 지역 ID 배열
 * @property {Array<number>} categories - 카테고리 ID 배열
 * @property {string} search - 검색어
 * @property {Array<string>} years - 연도 배열
 */

/**
 * API 응답 타입 정의
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 성공 여부
 * @property {any} data - 응답 데이터
 * @property {string} message - 응답 메시지
 * @property {number} status - HTTP 상태 코드
 */

/**
 * 필터 옵션을 조회합니다.
 * @returns {Promise<FilterOptions>} 필터 옵션 데이터
 * @throws {ApiError} API 호출 실패 시
 */
export const getFilterOptions = async () => {
  try {
    const response = await apiClient.get('/filters');
    
    if (!response.success) {
      throw new ApiError(response.message || '필터 옵션 조회에 실패했습니다.', response.status);
    }

    return response.data;
  } catch (error) {
    console.error('getFilterOptions error:', error);
    throw error;
  }
};

/**
 * 축제 목록을 조회합니다.
 * @param {FestivalFilters} filters - 필터 조건
 * @returns {Promise<{festivals: Array<Festival>, total: number}>} 축제 목록과 총 개수
 * @throws {ApiError} API 호출 실패 시
 */
export const getFestivals = async (filters = {}) => {
  try {
    // 필터 파라미터 정리
    const params = {};
    
    if (filters.regions && filters.regions.length > 0) {
      params.regions = filters.regions.join(',');
    }
    
    if (filters.categories && filters.categories.length > 0) {
      params.categories = filters.categories.join(',');
    }
    
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    
    if (filters.years && filters.years.length > 0) {
      params.years = filters.years.join(',');
    }

    const response = await apiClient.get('/festivals', params);
    
    if (!response.success) {
      throw new ApiError(response.message || '축제 목록 조회에 실패했습니다.', response.status);
    }

    return {
      festivals: response.data || [],
      total: response.total || 0
    };
  } catch (error) {
    console.error('getFestivals error:', error);
    throw error;
  }
};

/**
 * 특정 축제의 상세 정보를 조회합니다.
 * @param {number} id - 축제 ID
 * @returns {Promise<FestivalDetail>} 축제 상세 정보
 * @throws {ApiError} API 호출 실패 시
 */
export const getFestivalById = async (id) => {
  try {
    if (!id || typeof id !== 'number') {
      throw new ApiError('유효하지 않은 축제 ID입니다.', 400);
    }

    const response = await apiClient.get(`/festivals/${id}`);
    
    if (!response.success) {
      throw new ApiError(response.message || '축제 상세 정보 조회에 실패했습니다.', response.status);
    }

    return response.data;
  } catch (error) {
    console.error('getFestivalById error:', error);
    throw error;
  }
};

/**
 * 특정 축제의 연도별 통계를 조회합니다.
 * @param {number} id - 축제 ID
 * @param {Array<string>} years - 조회할 연도 배열 (선택사항)
 * @returns {Promise<YearlyStats>} 연도별 통계 데이터
 * @throws {ApiError} API 호출 실패 시
 */
export const getYearlyStats = async (id, years = []) => {
  try {
    if (!id || typeof id !== 'number') {
      throw new ApiError('유효하지 않은 축제 ID입니다.', 400);
    }

    const params = {};
    if (years && years.length > 0) {
      params.years = years.join(',');
    }

    const response = await apiClient.get(`/festivals/${id}/yearly-stats`, params);
    
    if (!response.success) {
      throw new ApiError(response.message || '연도별 통계 조회에 실패했습니다.', response.status);
    }

    return response.data;
  } catch (error) {
    console.error('getYearlyStats error:', error);
    throw error;
  }
};

/**
 * 축제 데이터를 검색합니다.
 * @param {string} query - 검색어
 * @param {FestivalFilters} additionalFilters - 추가 필터 조건
 * @returns {Promise<{festivals: Array<Festival>, total: number}>} 검색 결과
 * @throws {ApiError} API 호출 실패 시
 */
export const searchFestivals = async (query, additionalFilters = {}) => {
  try {
    const filters = {
      ...additionalFilters,
      search: query
    };

    return await getFestivals(filters);
  } catch (error) {
    console.error('searchFestivals error:', error);
    throw error;
  }
};

/**
 * 지역별 축제 목록을 조회합니다.
 * @param {number} regionId - 지역 ID
 * @param {FestivalFilters} additionalFilters - 추가 필터 조건
 * @returns {Promise<{festivals: Array<Festival>, total: number}>} 지역별 축제 목록
 * @throws {ApiError} API 호출 실패 시
 */
export const getFestivalsByRegion = async (regionId, additionalFilters = {}) => {
  try {
    const filters = {
      ...additionalFilters,
      regions: [regionId]
    };

    return await getFestivals(filters);
  } catch (error) {
    console.error('getFestivalsByRegion error:', error);
    throw error;
  }
};

/**
 * 카테고리별 축제 목록을 조회합니다.
 * @param {number} categoryId - 카테고리 ID
 * @param {FestivalFilters} additionalFilters - 추가 필터 조건
 * @returns {Promise<{festivals: Array<Festival>, total: number}>} 카테고리별 축제 목록
 * @throws {ApiError} API 호출 실패 시
 */
export const getFestivalsByCategory = async (categoryId, additionalFilters = {}) => {
  try {
    const filters = {
      ...additionalFilters,
      categories: [categoryId]
    };

    return await getFestivals(filters);
  } catch (error) {
    console.error('getFestivalsByCategory error:', error);
    throw error;
  }
};

/**
 * 축제 서비스의 기본 export
 */
const festivalService = {
  getFilterOptions,
  getFestivals,
  getFestivalById,
  getYearlyStats,
  searchFestivals,
  getFestivalsByRegion,
  getFestivalsByCategory
};

export default festivalService;
