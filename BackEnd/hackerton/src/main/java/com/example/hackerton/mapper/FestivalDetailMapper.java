package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


import com.example.hackerton.domain.FestivalDetail;


@Mapper
public interface FestivalDetailMapper {
    FestivalDetail findByFestivalId(Long festivalId);
    List<FestivalDetail> findByYear(Integer year);
    List<FestivalDetail> findAll();
    void insert(FestivalDetail festivalDetail);
    void update(FestivalDetail festivalDetail);
    void delete(Long festivalId);
}
