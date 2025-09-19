package com.example.hackerton.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.hackerton.domain.FestivalLog;

@Mapper
public interface FestivalLogMapper {
    List<FestivalLog> findRecentPredictions();
    void insertPredictionLog(FestivalLog log);
    List<FestivalLog> findByFestivalId(Long festivalId);
}
