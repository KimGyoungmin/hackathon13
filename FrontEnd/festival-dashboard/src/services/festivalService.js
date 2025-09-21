/**
 * 축제 서비스 클래스
 * 
 * 역할: 축제 관련 API 호출을 담당
 * - 필터 옵션 조회
 * - 축제 목록 조회
 * - 필터링된 축제 조회
 * - 축제 상세 정보 조회
 */

import apiService from './api.js';

class FestivalService {
  /**
   * 필터 옵션 조회 (지역, 카테고리, 연도)
   * @returns {Promise<Object>} 필터 옵션 데이터
   */
  async getFilterOptions() {
    try {
      const response = await apiService.get('/filters');
      return response.data; // Axios는 이미 response.data를 반환
    } catch (error) {
      console.error('필터 옵션 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 모든 축제 목록 조회
   * @returns {Promise<Array>} 축제 목록
   */
  async getAllFestivals() {
    try {
      const response = await apiService.get('/festivals');
      return response.data; // Axios는 이미 response.data를 반환
    } catch (error) {
      console.error('축제 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 필터링된 축제 목록 조회
   * @param {Object} filters - 필터 조건
   * @param {string} filters.regions - 지역 ID들 (쉼표로 구분)
   * @param {string} filters.categories - 카테고리 ID들 (쉼표로 구분)
   * @param {string} filters.search - 검색어
   * @param {string} filters.years - 연도들 (쉼표로 구분)
   * @returns {Promise<Array>} 필터링된 축제 목록
   */
  async getFilteredFestivals(filters = {}) {
    try {
      const response = await apiService.get('/festivals', filters);
      return response.data; // Axios는 이미 response.data를 반환
    } catch (error) {
      console.error('필터링된 축제 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 지역의 축제 목록 조회
   * @param {number} locationId - 지역 ID
   * @returns {Promise<Array>} 해당 지역의 축제 목록
   */
  async getFestivalsByLocation(locationId) {
    try {
      const response = await apiService.get(`/festivals/location/${locationId}`);
      return response.data; // Axios는 이미 response.data를 반환
    } catch (error) {
      console.error('지역별 축제 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 축제의 상세 정보 조회
   * @param {number} festivalId - 축제 ID
   * @returns {Promise<Object>} 축제 상세 정보
   */
  async getFestivalDetail(festivalId) {
    try {
      const response = await apiService.get(`/festivals/${festivalId}`);
      return response.data; // Axios는 이미 response.data를 반환
    } catch (error) {
      console.error('축제 상세 정보 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 특정 축제의 연도별 통계 조회
   * @param {number} festivalId - 축제 ID
   * @param {string} years - 연도들 (쉼표로 구분)
   * @returns {Promise<Object>} 연도별 통계 데이터
   */
  async getYearlyStats(festivalId, years = null) {
    try {
      const params = years ? { years } : {};
      const response = await apiService.get(`/festivals/${festivalId}/yearly-stats`, params);
      return response.data; // Axios는 이미 response.data를 반환
    } catch (error) {
      console.error('연도별 통계 조회 실패:', error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
const festivalService = new FestivalService();

export default festivalService;
