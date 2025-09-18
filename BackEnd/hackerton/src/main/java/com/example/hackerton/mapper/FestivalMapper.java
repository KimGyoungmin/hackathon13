package com.example.hackerton.mapper;

import java.util.List;

import com.example.hackerton.domain.Festival;

public interface FestivalMapper {
    List<Festival> findAll();
    Festival findById(Long festivalId);
    void insert(Festival festival);
    void update(Festival festival);
    void delete(Long festivalId);
}
