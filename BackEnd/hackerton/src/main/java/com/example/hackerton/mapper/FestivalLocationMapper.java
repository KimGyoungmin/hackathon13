package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.hackerton.domain.FestivalLocation;

/**
 * 축제 지역 정보를 조회하는 매퍼 인터페이스
 * 시/군 필터링을 위한 데이터 접근을 담당합니다.
 */
@Mapper
public interface FestivalLocationMapper {
    
    /**
     * 모든 지역 정보를 조회합니다.
     * 메인 페이지에서 시/군 필터링 옵션을 제공하기 위해 사용됩니다.
     * 
     * @return 모든 지역 정보 리스트
     */
    List<FestivalLocation> findAllLocations();
}
