package com.example.hackerton.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hackerton.domain.Category;
import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.FestivalDetail;
import com.example.hackerton.domain.FestivalLog;
import com.example.hackerton.service.FestivalService;

@RestController
@RequestMapping("/api")
public class FestivalController {
    
    @Autowired
    private FestivalService festivalService;

    // Festival 관련 API
    // 전체 Festival 조회
    // 메인 대시보드에 전달할 데이터
    // @GetMapping("/festivals")
    // public ResponseEntity<List<Festival>> getAllFestivals() {
    //     List<Festival> festivals = festivalService.getAllFestivals();
    //     return ResponseEntity.ok(festivals);
    // }

    @GetMapping("/api/festivals")
    public List<Festival> getFestivals(
        @RequestParam(required = false) String year,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String location
    ) {
        return festivalService.getFilteredFestivals(year, category, location);
    }
    
    // 특정 Festival 조회
    // 메인보드에서 축제 하나를 선택하면 해당 축제의 id값을 토대로 조회
    // api 일단 보류
    @GetMapping("/festivals/{id}")
    public ResponseEntity<Festival> getFestivalById(@PathVariable Long id) {
        Festival festival = festivalService.getFestivalById(id);
        if (festival != null) {
            return ResponseEntity.ok(festival);
        }
        return ResponseEntity.notFound().build();
    }
    

    // Category별 Festival 조회
    // 해당 category의 매출 순위
    @GetMapping("/festivals/category/{categoryId}")
    public ResponseEntity<List<Festival>> getFestivalsByCategory(@PathVariable Long categoryId) {
        List<Festival> festivals = festivalService.getFestivalsByCategory(categoryId);
        return ResponseEntity.ok(festivals);
    }
    
    @GetMapping("/festivals/search")
    public ResponseEntity<List<Festival>> searchFestivals(@RequestParam String keyword) {
        List<Festival> festivals = festivalService.searchFestivalsByName(keyword);
        return ResponseEntity.ok(festivals);
    }
    
    @PostMapping("/festivals")
    public ResponseEntity<Festival> createFestival(@RequestBody Festival festival) {
        festivalService.createFestival(festival);
        return ResponseEntity.status(HttpStatus.CREATED).body(festival);
    }
    
    @PutMapping("/festivals/{id}")
    public ResponseEntity<Festival> updateFestival(@PathVariable Long id, @RequestBody Festival festival) {
        festival.setFestivalId(id);
        festivalService.updateFestival(festival);
        return ResponseEntity.ok(festival);
    }
    
    @DeleteMapping("/festivals/{id}")
    public ResponseEntity<Void> deleteFestival(@PathVariable Long id) {
        festivalService.deleteFestival(id);
        return ResponseEntity.noContent().build();
    }
    
    // Category 관련 API
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = festivalService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = festivalService.getCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        festivalService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        category.setCategoryId(id);
        festivalService.updateCategory(category);
        return ResponseEntity.ok(category);
    }
    
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        festivalService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
    
    // FestivalDetail 관련 API
    @GetMapping("/festival-details")
    public ResponseEntity<List<FestivalDetail>> getAllFestivalDetails() {
        List<FestivalDetail> details = festivalService.getAllFestivalDetails();
        return ResponseEntity.ok(details);
    }
    
    @GetMapping("/festival-details/{festivalId}")
    public ResponseEntity<FestivalDetail> getFestivalDetail(@PathVariable Long festivalId) {
        FestivalDetail detail = festivalService.getFestivalDetail(festivalId);
        if (detail != null) {
            return ResponseEntity.ok(detail);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/festival-details/year/{year}")
    public ResponseEntity<List<FestivalDetail>> getFestivalDetailsByYear(@PathVariable Integer year) {
        List<FestivalDetail> details = festivalService.getFestivalDetailsByYear(year);
        return ResponseEntity.ok(details);
    }
    
    @PostMapping("/festival-details")
    public ResponseEntity<FestivalDetail> createFestivalDetail(@RequestBody FestivalDetail festivalDetail) {
        festivalService.createFestivalDetail(festivalDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(festivalDetail);
    }
    
    @PutMapping("/festival-details/{festivalId}")
    public ResponseEntity<FestivalDetail> updateFestivalDetail(@PathVariable Long festivalId, @RequestBody FestivalDetail festivalDetail) {
        festivalDetail.setFestivalId(festivalId);
        festivalService.updateFestivalDetail(festivalDetail);
        return ResponseEntity.ok(festivalDetail);
    }
    
    @DeleteMapping("/festival-details/{festivalId}")
    public ResponseEntity<Void> deleteFestivalDetail(@PathVariable Long festivalId) {
        festivalService.deleteFestivalDetail(festivalId);
        return ResponseEntity.noContent().build();
    }
    
    // FestivalLog 관련 API
    @GetMapping("/festival-logs")
    public ResponseEntity<List<FestivalLog>> getAllFestivalLogs() {
        List<FestivalLog> logs = festivalService.getAllFestivalLogs();
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/festival-logs/{logId}")
    public ResponseEntity<FestivalLog> getFestivalLogById(@PathVariable Long logId) {
        FestivalLog log = festivalService.getFestivalLogById(logId);
        if (log != null) {
            return ResponseEntity.ok(log);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/festival-logs/festival/{festivalId}")
    public ResponseEntity<List<FestivalLog>> getFestivalLogsByFestivalId(@PathVariable Long festivalId) {
        List<FestivalLog> logs = festivalService.getFestivalLogsByFestivalId(festivalId);
        return ResponseEntity.ok(logs);
    }
    
    @GetMapping("/festival-logs/recent")
    public ResponseEntity<List<FestivalLog>> getRecentPredictions() {
        List<FestivalLog> logs = festivalService.getRecentPredictions();
        return ResponseEntity.ok(logs);
    }
    
    @PostMapping("/festival-logs")
    public ResponseEntity<FestivalLog> createFestivalLog(@RequestBody FestivalLog festivalLog) {
        festivalService.createFestivalLog(festivalLog);
        return ResponseEntity.status(HttpStatus.CREATED).body(festivalLog);
    }
    
    @PutMapping("/festival-logs/{logId}")
    public ResponseEntity<FestivalLog> updateFestivalLog(@PathVariable Long logId, @RequestBody FestivalLog festivalLog) {
        festivalLog.setLogId(logId);
        festivalService.updateFestivalLog(festivalLog);
        return ResponseEntity.ok(festivalLog);
    }
    
    @DeleteMapping("/festival-logs/{logId}")
    public ResponseEntity<Void> deleteFestivalLog(@PathVariable Long logId) {
        festivalService.deleteFestivalLog(logId);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/festival-logs/{logId}/soft-delete")
    public ResponseEntity<Void> softDeleteFestivalLog(@PathVariable Long logId) {
        festivalService.softDeleteFestivalLog(logId);
        return ResponseEntity.noContent().build();
    }

    // 지역 관련 API
    
}
