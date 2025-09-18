package com.example.hackerton.mapper;

import java.util.List;

import com.example.hackerton.domain.FestivalLog;

public interface FestivalLogMapper {
    List<FestivalLog> findRecentPredictions();
    void insertPredictionLog(FestivalLog log);
    List<FestivalLog> findByFestivalId(Long festivalId);
}
