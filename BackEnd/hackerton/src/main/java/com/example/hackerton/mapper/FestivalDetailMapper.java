package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.hackerton.domain.FestivalDetail;

@Mapper
public interface FestivalDetailMapper {
    List<FestivalDetail> findByFestivalId(Long festivalId);
    List<FestivalDetail> findByYear(Integer year);
    void insert(FestivalDetail festivalDetail);
}
