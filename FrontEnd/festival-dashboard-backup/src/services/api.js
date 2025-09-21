/**
 * 기본 API 클라이언트 클래스
 * 모든 API 호출의 기본 기능을 제공합니다.
 */

// 환경변수에서 API URL 가져오기 (기본값 설정)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true' || false;

/**
 * API 응답 타입 정의
 * @typedef {Object} ApiResponse
 * @property {boolean} success - 요청 성공 여부
 * @property {any} data - 응답 데이터
 * @property {string} message - 응답 메시지
 * @property {number} status - HTTP 상태 코드
 */

/**
 * API 에러 클래스
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * 기본 API 클라이언트 클래스
 */
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * 기본 fetch 래퍼
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} options - fetch 옵션
   * @returns {Promise<ApiResponse>}
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    if (DEBUG_MODE) {
      console.log(`[API] ${config.method || 'GET'} ${url}`, config);
    }

    try {
      const response = await fetch(url, config);
      
      // 응답이 JSON인지 확인
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      let data;
      if (isJson) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP error! status: ${response.status}`,
          response.status,
          data
        );
      }

      if (DEBUG_MODE) {
        console.log(`[API] Response:`, data);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success',
        status: response.status,
      };
    } catch (error) {
      if (DEBUG_MODE) {
        console.error(`[API] Error:`, error);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      // 네트워크 에러나 기타 에러
      throw new ApiError(
        error.message || 'Network error occurred',
        0,
        null
      );
    }
  }

  /**
   * GET 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} params - 쿼리 파라미터
   * @returns {Promise<ApiResponse>}
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} data - 요청 데이터
   * @returns {Promise<ApiResponse>}
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT 요청
   * @param {string} endpoint - API 엔드포인트
   * @param {Object} data - 요청 데이터
   * @returns {Promise<ApiResponse>}
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE 요청
   * @param {string} endpoint - API 엔드포인트
   * @returns {Promise<ApiResponse>}
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// 기본 API 클라이언트 인스턴스 생성
const apiClient = new ApiClient();

// Mock 데이터 (개발용)
const mockData = {
  filters: {
    success: true,
    data: {
      regions: [
        { id: 1, name: "강진군", festivalCount: 15 },
        { id: 2, name: "곡성군", festivalCount: 8 },
        { id: 3, name: "기타지역", festivalCount: 5 },
        { id: 4, name: "나주시", festivalCount: 12 },
        { id: 5, name: "담양군", festivalCount: 10 },
        { id: 6, name: "목포시", festivalCount: 18 },
        { id: 7, name: "무안군", festivalCount: 7 },
        { id: 8, name: "보성군", festivalCount: 9 },
        { id: 9, name: "순천시", festivalCount: 14 },
        { id: 10, name: "영광군", festivalCount: 6 },
        { id: 11, name: "장성군", festivalCount: 11 },
        { id: 12, name: "함평군", festivalCount: 8 },
        { id: 13, name: "해남군", festivalCount: 13 },
        { id: 14, name: "화순군", festivalCount: 7 }
      ],
      categories: [
        { id: 1, name: "문화/역사", festivalCount: 45 },
        { id: 2, name: "음식/미식", festivalCount: 32 },
        { id: 3, name: "일반/기타", festivalCount: 28 },
        { id: 4, name: "자연/계절", festivalCount: 38 },
        { id: 5, name: "체험/레저", festivalCount: 25 }
      ],
      years: ["2020", "2021", "2022", "2023", "2024"]
    }
  },

  festivals: {
    success: true,
    data: [
      {
        id: 1,
        name: "강진만춤추는갈대축제",
        region: "강진군",
        category: "자연/계절",
        latitude: 34.6421,
        longitude: 126.7672,
        totalVisitors: 45000,
        revenue: 850000000
      },
      {
        id: 2,
        name: "나주배축제",
        region: "나주시",
        category: "자연/계절",
        latitude: 35.0156,
        longitude: 126.7108,
        totalVisitors: 82000,
        revenue: 1250000000
      }
    ],
    total: 520
  },

  festivalDetail: {
    success: true,
    data: {
      id: 1,
      name: "강진만춤추는갈대축제",
      region: "강진군",
      category: "자연/계절",
      period: {
        startDate: "2024-10-15",
        endDate: "2024-10-18"
      },
      stats: {
        totalVisitors: 45000,
        averageVisitors: 42000,
        totalRevenue: 850000000,
        growthRate: 12
      }
    }
  },

  yearlyStats: {
    success: true,
    data: {
      festivalId: 1,
      yearlyData: [
        { year: 2022, visitors: 38000, revenue: 720000000 },
        { year: 2023, visitors: 41000, revenue: 780000000 },
        { year: 2024, visitors: 45000, revenue: 850000000 }
      ]
    }
  }
};

/**
 * Mock API 클라이언트
 */
class MockApiClient {
  async get(endpoint) {
    // 실제 API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

    if (endpoint === '/filters') {
      return mockData.filters;
    } else if (endpoint.startsWith('/festivals/') && endpoint.includes('/yearly-stats')) {
      return mockData.yearlyStats;
    } else if (endpoint.startsWith('/festivals/') && !endpoint.includes('/yearly-stats')) {
      return mockData.festivalDetail;
    } else if (endpoint === '/festivals') {
      return mockData.festivals;
    }

    throw new ApiError('Mock endpoint not found', 404);
  }
}

// Mock 클라이언트 인스턴스
const mockApiClient = new MockApiClient();

// 환경에 따라 적절한 클라이언트 선택
const client = USE_MOCK_DATA ? mockApiClient : apiClient;

export { ApiClient, ApiError, client as apiClient };
export default client;