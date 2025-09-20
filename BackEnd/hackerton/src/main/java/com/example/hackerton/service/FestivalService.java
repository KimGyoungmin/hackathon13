package com.example.hackerton.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.Location;
import com.example.hackerton.mapper.LocationMapper;
import com.example.hackerton.mapper.FestivalMapper;

/**
 * 축제 관련 비즈니스 로직을 처리하는 서비스 클래스
 * 필터링 기능을 제공합니다.
 */
@Service
@Transactional
public class FestivalService {
    
    @Autowired
    private FestivalMapper festivalMapper;
    
    @Autowired
    private LocationMapper locationMapper;
    
    /**
     * 모든 지역 정보를 조회합니다.
     * 메인 페이지에서 시/군 필터링 옵션을 제공하기 위해 사용됩니다.
     * 
     * @return 모든 지역 정보 리스트
     */
    @Transactional(readOnly = true)
    public List<Location> getAllLocations() {
        return locationMapper.findAllLocations();
    }
    
    /**
     * 특정 지역의 모든 축제를 조회합니다.
     * 시/군 필터링 후 해당 지역의 축제 목록을 보여주기 위해 사용됩니다.
     * 
     * @param locationId 지역 ID
     * @return 해당 지역의 축제 리스트
     */
    @Transactional(readOnly = true)
    public List<Festival> getFestivalsByLocation(Long locationId) {
        return festivalMapper.findFestivalsByLocation(locationId);
    }
    
    /**
     * 특정 지역과 카테고리로 축제를 필터링하여 조회합니다.
     * 시/군과 축제 카테고리를 동시에 필터링할 때 사용됩니다.
     * 
     * @param locationId 지역 ID
     * @param categoryIds 카테고리 ID 리스트 (다중 선택 가능)
     * @return 필터링된 축제 리스트
     */
    @Transactional(readOnly = true)
    public List<Festival> getFestivalsByLocationAndCategories(Long locationId, List<Long> categoryIds) {
        return festivalMapper.findFestivalsByLocationAndCategories(locationId, categoryIds);
    }
}
