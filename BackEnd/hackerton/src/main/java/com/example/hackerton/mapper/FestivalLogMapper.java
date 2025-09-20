package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;


import com.example.hackerton.domain.FestivalLog;

@Mapper
public interface FestivalLogMapper {
    List<FestivalLog> findAll();
    FestivalLog findById(Long logId);
    List<FestivalLog> findByFestivalId(Long festivalId);
    List<FestivalLog> findRecentPredictions();
    void insert(FestivalLog log);
    void update(FestivalLog log);
    void delete(Long logId);
    void softDelete(Long logId);
}
