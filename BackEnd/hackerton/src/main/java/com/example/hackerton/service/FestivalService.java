package com.example.hackerton.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.FestivalDetail;
import com.example.hackerton.domain.FestivalStatistics;
import com.example.hackerton.domain.Location;
import com.example.hackerton.domain.Category;
import com.example.hackerton.mapper.LocationMapper;
import com.example.hackerton.mapper.FestivalMapper;
import com.example.hackerton.mapper.CategoryMapper;

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
    
    @Autowired
    private CategoryMapper categoryMapper;
    
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
    
    /**
     * 모든 카테고리 정보를 조회합니다.
     * 
     * @return 모든 카테고리 정보 리스트
     */
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryMapper.findAllCategories();
    }
    
    /**
     * 필터링 조건에 따라 축제 목록을 조회합니다.
     * 
     * @param regions 지역 ID 리스트 (쉼표로 구분된 문자열)
     * @param categories 카테고리 ID 리스트 (쉼표로 구분된 문자열)
     * @param search 검색어
     * @param years 연도 리스트 (쉼표로 구분된 문자열)
     * @return 필터링된 축제 리스트
     */
    @Transactional(readOnly = true)
    public List<Festival> getFilteredFestivals(String regions, String categories, String search, String years) {
        // 모든 축제를 가져온 후 필터링 (실제 구현에서는 DB 쿼리로 최적화 가능)
        List<Festival> allFestivals = festivalMapper.findAllFestivals();
        
        return allFestivals.stream()
            .filter(festival -> {
                // 지역 필터링
                if (regions != null && !regions.isEmpty()) {
                    List<Long> regionIds = Arrays.stream(regions.split(","))
                        .map(String::trim)
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
                    if (!regionIds.contains(festival.getLocationId())) {
                        return false;
                    }
                }
                
                // 카테고리 필터링
                if (categories != null && !categories.isEmpty()) {
                    List<Long> categoryIds = Arrays.stream(categories.split(","))
                        .map(String::trim)
                        .map(Long::parseLong)
                        .collect(Collectors.toList());
                    if (!categoryIds.contains(festival.getCategoryId())) {
                        return false;
                    }
                }
                
                // 검색어 필터링
                if (search != null && !search.isEmpty()) {
                    String searchLower = search.toLowerCase();
                    if (!festival.getName().toLowerCase().contains(searchLower) &&
                        !festival.getLocation().getName().toLowerCase().contains(searchLower)) {
                        return false;
                    }
                }
                
                return true;
            })
            .collect(Collectors.toList());
    }
    
    /**
     * 특정 축제의 상세 정보를 조회합니다.
     * 
     * @param id 축제 ID
     * @return 축제 상세 정보
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getFestivalDetail(Long id) {
        Festival festival = festivalMapper.findFestivalById(id);
        if (festival == null) {
            return new HashMap<>();
        }
        
        Map<String, Object> detail = new HashMap<>();
        detail.put("id", festival.getId());
        detail.put("name", festival.getName());
        detail.put("region", festival.getLocation().getName());
        detail.put("category", festival.getCategory().getName());
        
        // 기간 정보 (임시 데이터)
        Map<String, String> period = new HashMap<>();
        period.put("startDate", "2024-09-15");
        period.put("endDate", "2024-09-18");
        detail.put("period", period);
        
        // 통계 정보 (임시 데이터)
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVisitors", 82000);
        stats.put("averageVisitors", 78000);
        stats.put("totalRevenue", 1250000000);
        stats.put("growthRate", 15);
        detail.put("stats", stats);
        
        return detail;
    }
    
    /**
     * 중복 제거된 고유 축제 목록을 조회합니다.
     * 
     * @return 고유 축제 리스트 (축제명 기준으로 중복 제거)
     */
    @Transactional(readOnly = true)
    public List<Festival> getUniqueFestivals() {
        List<Festival> allFestivals = festivalMapper.findAllFestivals();
        
        // 축제명 기준으로 중복 제거 (가장 최신 데이터 유지)
        Map<String, Festival> uniqueFestivals = new HashMap<>();
        
        for (Festival festival : allFestivals) {
            String festivalName = festival.getFestivalNm();
            if (!uniqueFestivals.containsKey(festivalName) || 
                (festival.getYear() != null && 
                 (uniqueFestivals.get(festivalName).getYear() == null || 
                  festival.getYear() > uniqueFestivals.get(festivalName).getYear()))) {
                uniqueFestivals.put(festivalName, festival);
            }
        }
        
        return new ArrayList<>(uniqueFestivals.values());
    }

    /**
     * 특정 축제의 연도별 통계를 조회합니다.
     * 
     * @param id 축제 ID
     * @param years 연도 리스트 (쉼표로 구분된 문자열)
     * @return 연도별 통계 데이터
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getYearlyStats(Long id, String years) {
        Map<String, Object> result = new HashMap<>();
        result.put("festivalId", id);
        
        // 연도별 데이터 (임시 데이터)
        List<Map<String, Object>> yearlyData = new ArrayList<>();
        
        List<String> yearList = Arrays.asList("2022", "2023", "2024");
        if (years != null && !years.isEmpty()) {
            yearList = Arrays.asList(years.split(","));
        }
        
        for (String year : yearList) {
            Map<String, Object> yearData = new HashMap<>();
            yearData.put("year", Integer.parseInt(year));
            
            // 임시 데이터 (실제로는 DB에서 조회)
            switch (year) {
                case "2022":
                    yearData.put("visitors", 65000);
                    yearData.put("revenue", 980000000);
                    break;
                case "2023":
                    yearData.put("visitors", 52000);
                    yearData.put("revenue", 785000000);
                    break;
                case "2024":
                    yearData.put("visitors", 82000);
                    yearData.put("revenue", 1250000000);
                    break;
                default:
                    yearData.put("visitors", 50000);
                    yearData.put("revenue", 750000000);
            }
            
            yearlyData.add(yearData);
        }
        
        result.put("yearlyData", yearlyData);
        return result;
    }

    /**
     * 축제별 년도별 통계 데이터를 조회합니다.
     *
     * @param festivalNames 축제명 리스트
     * @param years 년도 리스트
     * @return 통계 데이터
     */
    public FestivalStatistics getFestivalStatistics(List<String> festivalNames, List<Integer> years) {
        return festivalMapper.getFestivalStatistics(festivalNames, years);
    }

    /**
     * 축제별 년도별 상세 데이터를 조회합니다.
     *
     * @param festivalNames 축제명 리스트
     * @param years 년도 리스트
     * @return 상세 데이터 리스트
     */
    public List<FestivalDetail> getFestivalDetails(List<String> festivalNames, List<Integer> years) {
        return festivalMapper.getFestivalDetails(festivalNames, years);
    }
}
