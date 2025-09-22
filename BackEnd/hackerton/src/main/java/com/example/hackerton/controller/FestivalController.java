package com.example.hackerton.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.FestivalDetail;
import com.example.hackerton.domain.FestivalStatistics;
import com.example.hackerton.domain.Location;
import com.example.hackerton.domain.Category;
import com.example.hackerton.service.FestivalService;

/**
 * 축제 관련 API를 제공하는 컨트롤러 클래스
 * 필터링 기능을 위한 REST API 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/api")
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
    
    /**
     * 필터 옵션을 조회하는 API
     * 프론트엔드에서 지역, 카테고리, 연도 옵션을 가져오기 위해 사용됩니다.
     * 
     * @return 필터 옵션 (지역, 카테고리, 연도)
     */
    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getFilters() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        Map<String, Object> data = new HashMap<>();
        
        // 지역 정보
        List<Location> locations = festivalService.getAllLocations();
        data.put("regions", locations);
        
        // 카테고리 정보
        List<Category> categories = festivalService.getAllCategories();
        data.put("categories", categories);
        
        // 연도 정보 (2020-2024)
        data.put("years", List.of("2020", "2021", "2022", "2023", "2024"));
        
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    /**
     * 축제 목록을 조회하는 API
     * 필터링 조건에 따라 축제 목록을 반환합니다.
     * 
     * @param regions 지역 ID 리스트 (쉼표로 구분)
     * @param categories 카테고리 ID 리스트 (쉼표로 구분)
     * @param search 검색어
     * @param years 연도 리스트 (쉼표로 구분)
     * @return 필터링된 축제 목록
     */
    @GetMapping("/festivals")
    public ResponseEntity<Map<String, Object>> getFestivals(
            @RequestParam(required = false) String regions,
            @RequestParam(required = false) String categories,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String years) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        List<Festival> festivals = festivalService.getFilteredFestivals(regions, categories, search, years);
        response.put("data", festivals);
        response.put("total", festivals.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 특정 축제의 상세 정보를 조회하는 API
     * 
     * @param id 축제 ID
     * @return 축제 상세 정보
     */
    @GetMapping("/festivals/{id}")
    public ResponseEntity<Map<String, Object>> getFestivalDetail(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        Map<String, Object> data = festivalService.getFestivalDetail(id);
        response.put("data", data);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 중복 제거된 고유 축제 목록을 조회하는 API
     * 
     * @return 고유 축제 목록 (중복 제거)
     */
    @GetMapping("/festivals/unique")
    public ResponseEntity<Map<String, Object>> getUniqueFestivals() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        List<Festival> uniqueFestivals = festivalService.getUniqueFestivals();
        response.put("data", uniqueFestivals);
        response.put("total", uniqueFestivals.size());
        
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 축제의 연도별 통계를 조회하는 API
     * 
     * @param id 축제 ID
     * @param years 연도 리스트 (쉼표로 구분)
     * @return 연도별 통계 데이터
     */
    @GetMapping("/festivals/{id}/yearly-stats")
    public ResponseEntity<Map<String, Object>> getYearlyStats(
            @PathVariable Long id,
            @RequestParam(required = false) String years) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        
        Map<String, Object> data = festivalService.getYearlyStats(id, years);
        response.put("data", data);
        
        return ResponseEntity.ok(response);
    }

    /**
     * 축제별 년도별 통계 데이터를 조회하는 API
     *
     * @param festivalNames 축제명 리스트 (쉼표로 구분)
     * @param years 년도 리스트 (쉼표로 구분)
     * @return 통계 데이터
     */
    @GetMapping("/festivals/statistics")
    public ResponseEntity<FestivalStatistics> getFestivalStatistics(
            @RequestParam(required = false) List<String> festivalNames,
            @RequestParam(required = false) List<Integer> years) {

        FestivalStatistics statistics = festivalService.getFestivalStatistics(festivalNames, years);
        return ResponseEntity.ok(statistics);
    }

    /**
     * 축제별 년도별 상세 데이터를 조회하는 API
     *
     * @param festivalNames 축제명 리스트 (쉼표로 구분)
     * @param years 년도 리스트 (쉼표로 구분)
     * @return 상세 데이터 리스트
     */
    @GetMapping("/festivals/details")
    public ResponseEntity<List<FestivalDetail>> getFestivalDetails(
            @RequestParam(required = false) List<String> festivalNames,
            @RequestParam(required = false) List<Integer> years) {

        List<FestivalDetail> details = festivalService.getFestivalDetails(festivalNames, years);
        return ResponseEntity.ok(details);
    }
}
