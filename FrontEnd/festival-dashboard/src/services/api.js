  /**
   * API 서비스 클래스 (Axios 기반)
   * 
   * 역할: 백엔드 API와의 통신을 담당
   * - HTTP 요청 처리
   * - 에러 핸들링
   * - 데이터 변환
   * - 로딩 상태 관리
   * - 인터셉터를 통한 요청/응답 처리
   */

  import axios from 'axios';

  const API_BASE_URL = 'http://localhost:8080/api';

  // Axios 인스턴스 생성
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10초 타임아웃
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`🚀 API 요청: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('❌ 요청 인터셉터 에러:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`✅ API 응답: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('❌ 응답 인터셉터 에러:', error);
      
      // 에러 타입별 처리
      if (error.response) {
        // 서버에서 응답을 받았지만 에러 상태
        console.error('서버 에러:', error.response.status, error.response.data);
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        console.error('네트워크 에러:', error.request);
      } else {
        // 요청 설정 중 에러
        console.error('요청 설정 에러:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  class ApiService {
    /**
     * GET 요청 처리
     * @param {string} endpoint - API 엔드포인트
     * @param {Object} params - 쿼리 파라미터
     * @returns {Promise} API 응답
     */
    async get(endpoint, params = {}) {
      try {
        const response = await apiClient.get(endpoint, { params });
        return response.data; // Axios는 자동으로 response.data 반환
      } catch (error) {
        console.error('API GET 요청 실패:', error);
        throw error;
      }
    }

    /**
     * POST 요청 처리
     * @param {string} endpoint - API 엔드포인트
     * @param {Object} data - 요청 데이터
     * @returns {Promise} API 응답
     */
    async post(endpoint, data = {}) {
      try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
      } catch (error) {
        console.error('API POST 요청 실패:', error);
        throw error;
      }
    }

    /**
     * PUT 요청 처리
     * @param {string} endpoint - API 엔드포인트
     * @param {Object} data - 요청 데이터
     * @returns {Promise} API 응답
     */
    async put(endpoint, data = {}) {
      try {
        const response = await apiClient.put(endpoint, data);
        return response.data;
      } catch (error) {
        console.error('API PUT 요청 실패:', error);
        throw error;
      }
    }

    /**
     * DELETE 요청 처리
     * @param {string} endpoint - API 엔드포인트
     * @returns {Promise} API 응답
     */
    async delete(endpoint) {
      try {
        const response = await apiClient.delete(endpoint);
        return response.data;
      } catch (error) {
        console.error('API DELETE 요청 실패:', error);
        throw error;
      }
    }
  }

  // 싱글톤 인스턴스 생성
  const apiService = new ApiService();

  export default apiService;
