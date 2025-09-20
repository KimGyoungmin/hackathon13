package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.hackerton.domain.Festival;
@Mapper
public interface FestivalMapper {
    List<Festival> findAll();
    Festival findById(Long festivalId);
    List<Festival> findByCategoryId(Long categoryId);
    List<Festival> findByNameContaining(String keyword);
    void insert(Festival festival);
    void update(Festival festival);
    void delete(Long festivalId);
}
