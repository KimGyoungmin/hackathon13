package com.example.hackerton.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hackerton.domain.Category;
import com.example.hackerton.domain.Festival;
import com.example.hackerton.domain.FestivalDetail;
import com.example.hackerton.domain.FestivalLog;
import com.example.hackerton.mapper.CategoryMapper;
import com.example.hackerton.mapper.FestivalDetailMapper;
import com.example.hackerton.mapper.FestivalLogMapper;
import com.example.hackerton.mapper.FestivalMapper;

@Service
@Transactional
public class FestivalService {

    @Autowired
    private FestivalMapper festivalMapper;
    
    @Autowired
    private CategoryMapper categoryMapper;
    
    @Autowired
    private FestivalDetailMapper festivalDetailMapper;
    
    @Autowired
    private FestivalLogMapper festivalLogMapper;

    // Festival 관련 메서드
    public List<Festival> getAllFestivals() {
        return festivalMapper.findAll();
    }
    
    public Festival getFestivalById(Long festivalId) {
        return festivalMapper.findById(festivalId);
    }
    
    public List<Festival> getFestivalsByCategory(Long categoryId) {
        return festivalMapper.findByCategoryId(categoryId);
    }
    
    public List<Festival> searchFestivalsByName(String keyword) {
        return festivalMapper.findByNameContaining(keyword);
    }
    
    public void createFestival(Festival festival) {
        festivalMapper.insert(festival);
    }
    
    public void updateFestival(Festival festival) {
        festivalMapper.update(festival);
    }
    
    public void deleteFestival(Long festivalId) {
        festivalMapper.delete(festivalId);
    }
    
    // Category 관련 메서드
    public List<Category> getAllCategories() {
        return categoryMapper.findAll();
    }
    
    public Category getCategoryById(Long categoryId) {
        return categoryMapper.findById(categoryId);
    }
    
    public void createCategory(Category category) {
        categoryMapper.insert(category);
    }
    
    public void updateCategory(Category category) {
        categoryMapper.update(category);
    }
    
    public void deleteCategory(Long categoryId) {
        categoryMapper.delete(categoryId);
    }
    
    // FestivalDetail 관련 메서드
    public FestivalDetail getFestivalDetail(Long festivalId) {
        return festivalDetailMapper.findByFestivalId(festivalId);
    }
    
    public List<FestivalDetail> getFestivalDetailsByYear(Integer year) {
        return festivalDetailMapper.findByYear(year);
    }
    
    public List<FestivalDetail> getAllFestivalDetails() {
        return festivalDetailMapper.findAll();
    }
    
    public void createFestivalDetail(FestivalDetail festivalDetail) {
        festivalDetailMapper.insert(festivalDetail);
    }
    
    public void updateFestivalDetail(FestivalDetail festivalDetail) {
        festivalDetailMapper.update(festivalDetail);
    }
    
    public void deleteFestivalDetail(Long festivalId) {
        festivalDetailMapper.delete(festivalId);
    }
    
    // FestivalLog 관련 메서드
    public List<FestivalLog> getAllFestivalLogs() {
        return festivalLogMapper.findAll();
    }
    
    public FestivalLog getFestivalLogById(Long logId) {
        return festivalLogMapper.findById(logId);
    }
    
    public List<FestivalLog> getFestivalLogsByFestivalId(Long festivalId) {
        return festivalLogMapper.findByFestivalId(festivalId);
    }
    
    public List<FestivalLog> getRecentPredictions() {
        return festivalLogMapper.findRecentPredictions();
    }
    
    public void createFestivalLog(FestivalLog festivalLog) {
        festivalLogMapper.insert(festivalLog);
    }
    
    public void updateFestivalLog(FestivalLog festivalLog) {
        festivalLogMapper.update(festivalLog);
    }
    
    public void deleteFestivalLog(Long logId) {
        festivalLogMapper.delete(logId);
    }
    
    public void softDeleteFestivalLog(Long logId) {
        festivalLogMapper.softDelete(logId);
    }
}
