package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.hackerton.domain.Category;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();
    List<Category> findAllCategories(); // Service에서 사용하는 메서드명과 일치
    Category findById(Long categoryId);
    Category findByName(String categoryName);
    void insert(Category category);
    void update(Category category);
    void delete(Long categoryId);
}
