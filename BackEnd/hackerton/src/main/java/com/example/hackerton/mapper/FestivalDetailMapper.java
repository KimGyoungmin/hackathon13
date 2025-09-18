package com.example.hackerton.mapper;

import java.util.List;

import com.example.hackerton.domain.FestivalDetail;

public interface FestivalDetailMapper {
    List<FestivalDetail> findByFestivalId(Long festivalId);
    List<FestivalDetail> findByYear(Integer year);
    void insert(FestivalDetail festivalDetail);
}
