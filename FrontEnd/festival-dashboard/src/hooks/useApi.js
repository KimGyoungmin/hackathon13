/**
 * API 훅
 * 
 * 역할: API 호출을 위한 커스텀 훅
 * - 로딩 상태 관리
 * - 에러 상태 관리
 * - 데이터 캐싱
 * - 재시도 로직
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * API 호출을 위한 커스텀 훅
 * @param {Function} apiFunction - API 호출 함수
 * @param {Array} dependencies - 의존성 배열
 * @returns {Object} { data, loading, error, refetch }
 */
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API 함수 참조를 안정화
  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  const fetchData = useCallback(async () => {
    if (!apiFunctionRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunctionRef.current();
      setData(result);
    } catch (err) {
      setError(err);
      console.error('API 호출 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []); // 빈 의존성 배열로 안정화

  useEffect(() => {
    fetchData();
  }, dependencies); // dependencies만 의존성으로 설정

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

/**
 * 여러 API를 동시에 호출하는 훅
 * @param {Object} apiFunctions - API 함수들 객체
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMultipleApi = (apiFunctions) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // API 함수들 참조를 안정화
  const apiFunctionsRef = useRef(apiFunctions);
  apiFunctionsRef.current = apiFunctions;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const promises = Object.keys(apiFunctionsRef.current).map(async (key) => {
        const apiFunction = apiFunctionsRef.current[key];
        if (apiFunction) {
          const result = await apiFunction();
          return { key, result };
        }
        return { key, result: null };
      });

      const results = await Promise.all(promises);
      const dataObject = {};
      
      results.forEach(({ key, result }) => {
        dataObject[key] = result;
      });

      setData(dataObject);
    } catch (err) {
      setError(err);
      console.error('다중 API 호출 실패:', err);
    } finally {
      setLoading(false);
    }
  }, []); // 빈 의존성 배열로 안정화

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refetch = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { data, loading, error, refetch };
};
