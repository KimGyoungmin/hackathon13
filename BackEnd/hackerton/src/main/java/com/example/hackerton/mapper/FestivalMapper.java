package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.FestivalDetail;
import com.example.hackerton.domain.FestivalStatistics;

/**
 * 축제 정보를 조회하는 매퍼 인터페이스
 * 축제 필터링을 위한 데이터 접근을 담당합니다.
 */
@Mapper
public interface FestivalMapper {

    /**
     * 특정 지역의 모든 축제를 조회합니다.
     * 시/군 필터링 후 해당 지역의 축제 목록을 보여주기 위해 사용됩니다.
     * 
     * @param locationId 지역 ID
     * @return 해당 지역의 축제 리스트
     */
    List<Festival> findFestivalsByLocation(@Param("locationId") Long locationId);
    
    /**
     * 특정 지역과 카테고리로 축제를 필터링하여 조회합니다.
     * 시/군과 축제 카테고리를 동시에 필터링할 때 사용됩니다.
     * 
     * @param locationId 지역 ID
     * @param categoryIds 카테고리 ID 리스트 (다중 선택 가능)
     * @return 필터링된 축제 리스트
     */
    List<Festival> findFestivalsByLocationAndCategories(
        @Param("locationId") Long locationId, 
        @Param("categoryIds") List<Long> categoryIds
    );
    
    /**
     * 모든 축제를 조회합니다.
     * 
     * @return 모든 축제 리스트
     */
    List<Festival> findAllFestivals();
    
    /**
     * 특정 ID의 축제를 조회합니다.
     *
     * @param id 축제 ID
     * @return 축제 정보
     */
    Festival findFestivalById(@Param("id") Long id);

    /**
     * 축제별 년도별 통계 데이터를 조회합니다.
     *
     * @param festivalNames 축제명 리스트
     * @param years 년도 리스트
     * @return 통계 데이터
     */
    FestivalStatistics getFestivalStatistics(
        @Param("festivalNames") List<String> festivalNames,
        @Param("years") List<Integer> years
    );

    /**
     * 축제별 년도별 상세 데이터를 조회합니다.
     *
     * @param festivalNames 축제명 리스트
     * @param years 년도 리스트
     * @return 상세 데이터 리스트
     */
    List<FestivalDetail> getFestivalDetails(
        @Param("festivalNames") List<String> festivalNames,
        @Param("years") List<Integer> years
    );
}
