import api from './api';

/**
 * 축제 관련 API 서비스
 * 백엔드의 FestivalController와 통신하여 필터링 기능을 제공합니다.
 */
class FestivalService {
  
  /**
   * 모든 지역 정보를 조회합니다.
   * 메인 페이지에서 시/군 필터링 옵션을 제공하기 위해 사용됩니다.
   * 
   * @returns {Promise<Array>} 지역 정보 리스트
   */
  async getAllLocations() {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      console.error('지역 정보 조회 실패:', error);
      throw new Error('지역 정보를 불러오는데 실패했습니다.');
    }
  }

  /**
   * 특정 지역의 모든 축제를 조회합니다.
   * 시/군 필터링 후 해당 지역의 축제 목록을 보여주기 위해 사용됩니다.
   * 
   * @param {number} locationId - 지역 ID
   * @returns {Promise<Array>} 해당 지역의 축제 리스트
   */
  async getFestivalsByLocation(locationId) {
    try {
      const response = await api.get(`/festivals/location/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('지역별 축제 조회 실패:', error);
      throw new Error('해당 지역의 축제 정보를 불러오는데 실패했습니다.');
    }
  }

  /**
   * 특정 지역과 카테고리로 축제를 필터링하여 조회합니다.
   * 시/군과 축제 카테고리를 동시에 필터링할 때 사용됩니다.
   * 
   * @param {number} locationId - 지역 ID
   * @param {Array<number>} categoryIds - 카테고리 ID 리스트 (다중 선택 가능)
   * @returns {Promise<Array>} 필터링된 축제 리스트
   */
  async getFestivalsByLocationAndCategories(locationId, categoryIds = []) {
    try {
      const params = new URLSearchParams();
      params.append('locationId', locationId);
      
      if (categoryIds && categoryIds.length > 0) {
        categoryIds.forEach(id => params.append('categoryIds', id));
      }
      
      const response = await api.get(`/festivals/filter?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('필터링된 축제 조회 실패:', error);
      throw new Error('필터링된 축제 정보를 불러오는데 실패했습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성
const festivalService = new FestivalService();

export default festivalService;
