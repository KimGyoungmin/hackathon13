/**
 * API 호출을 위한 커스텀 훅
 * 에러 처리 및 로딩 상태 관리를 포함합니다.
 */

import { useState, useCallback, useRef } from 'react';
import { ApiError } from '../services/api.js';

/**
 * API 호출 상태 타입 정의
 * @typedef {Object} ApiState
 * @property {boolean} loading - 로딩 상태
 * @property {any} data - 응답 데이터
 * @property {string|null} error - 에러 메시지
 * @property {number|null} status - HTTP 상태 코드
 */

/**
 * API 호출을 위한 커스텀 훅
 * @param {Function} apiFunction - 호출할 API 함수
 * @returns {Object} API 상태와 실행 함수
 */
export const useApi = (apiFunction) => {
  const [state, setState] = useState({
    loading: false,
    data: null,
    error: null,
    status: null
  });

  // apiFunction을 useRef로 저장하여 참조 안정성 확보
  const apiFunctionRef = useRef(apiFunction);
  apiFunctionRef.current = apiFunction;

  const execute = useCallback(async (...args) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      status: null
    }));

    try {
      const result = await apiFunctionRef.current(...args);
      
      setState({
        loading: false,
        data: result,
        error: null,
        status: 200
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '알 수 없는 오류가 발생했습니다.';
      
      const status = error instanceof ApiError ? error.status : 0;

      setState({
        loading: false,
        data: null,
        error: errorMessage,
        status
      });

      throw error;
    }
  }, []); // 의존성 배열을 비워서 apiFunction 변경에 영향받지 않도록 함

  const reset = useCallback(() => {
    setState({
      loading: false,
      data: null,
      error: null,
      status: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};

/**
 * 여러 API 호출을 관리하는 훅 (최대 3개까지 지원)
 * @param {Object} apiFunctions - API 함수 객체 (최대 3개)
 * @returns {Object} 각 API의 상태와 실행 함수들
 */
export const useMultipleApi = (apiFunctions) => {
  const apiKeys = Object.keys(apiFunctions);
  
  // 항상 동일한 순서로 훅을 호출 (최대 3개)
  const api1 = useApi(apiFunctions[apiKeys[0]] || (() => Promise.resolve(null)));
  const api2 = useApi(apiFunctions[apiKeys[1]] || (() => Promise.resolve(null)));
  const api3 = useApi(apiFunctions[apiKeys[2]] || (() => Promise.resolve(null)));

  const apis = [api1, api2, api3];
  const states = {};
  const executes = {};
  const resets = {};

  apis.forEach((api, index) => {
    if (apiKeys[index]) {
      const key = apiKeys[index];
      states[key] = { 
        loading: api.loading, 
        data: api.data, 
        error: api.error, 
        status: api.status 
      };
      executes[key] = api.execute;
      resets[key] = api.reset;
    }
  });

  return {
    states,
    executes,
    resets
  };
};

/**
 * 에러 메시지를 사용자 친화적으로 변환하는 함수
 * @param {Error|ApiError} error - 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
export const getErrorMessage = (error) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return '잘못된 요청입니다. 입력값을 확인해주세요.';
      case 401:
        return '인증이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 데이터를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case 0:
        return '네트워크 연결을 확인해주세요.';
      default:
        return error.message || '알 수 없는 오류가 발생했습니다.';
    }
  }
  
  return error.message || '알 수 없는 오류가 발생했습니다.';
};

/**
 * 로딩 상태를 관리하는 훅
 * @param {boolean} initialLoading - 초기 로딩 상태
 * @returns {Object} 로딩 상태와 제어 함수들
 */
export const useLoading = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading
  };
};

/**
 * 에러 상태를 관리하는 훅
 * @returns {Object} 에러 상태와 제어 함수들
 */
export const useError = () => {
  const [error, setError] = useState(null);

  const setErrorMessage = useCallback((message) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error) => {
    const message = getErrorMessage(error);
    setErrorMessage(message);
  }, [setErrorMessage]);

  return {
    error,
    setError: setErrorMessage,
    clearError,
    handleError
  };
};

export default useApi;
