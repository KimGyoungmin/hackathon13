package com.example.hackerton.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.Location;
import com.example.hackerton.service.FestivalService;

/**
 * 축제 관련 API를 제공하는 컨트롤러 클래스
 * 필터링 기능을 위한 REST API 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5174")
public class FestivalController {
    
    @Autowired
    private FestivalService festivalService;
    
    /**
     * 모든 지역 정보를 조회하는 API
     * 메인 페이지에서 시/군 필터링 옵션을 제공하기 위해 사용됩니다.
     * 
     * @return 모든 지역 정보 리스트
     */
    @GetMapping("/locations")
    public List<Location> getAllLocations() {
        return festivalService.getAllLocations();
    }
    
    /**
     * 특정 지역의 모든 축제를 조회하는 API
     * 시/군 필터링 후 해당 지역의 축제 목록을 보여주기 위해 사용됩니다.
     * 
     * @param locationId 지역 ID
     * @return 해당 지역의 축제 리스트
     */
    @GetMapping("/festivals/location/{locationId}")
    public List<Festival> getFestivalsByLocation(@PathVariable Long locationId) {
        return festivalService.getFestivalsByLocation(locationId);
    }
    
    /**
     * 특정 지역과 카테고리로 축제를 필터링하여 조회하는 API
     * 시/군과 축제 카테고리를 동시에 필터링할 때 사용됩니다.
     * 
     * @param locationId 지역 ID
     * @param categoryIds 카테고리 ID 리스트 (다중 선택 가능, 쉼표로 구분)
     * @return 필터링된 축제 리스트
     */
    @GetMapping("/festivals/filter")
    public List<Festival> getFestivalsByLocationAndCategories(
            @RequestParam Long locationId,
            @RequestParam(required = false) List<Long> categoryIds) {
        return festivalService.getFestivalsByLocationAndCategories(locationId, categoryIds);
    }
}
