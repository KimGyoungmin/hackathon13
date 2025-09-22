package com.example.hackerton.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 축제 통계 데이터 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalStatistics {
    private Long totalVisitors;
    private Long avgVisitors;
    private Long totalSales;
    private Long avgSales;
    private Integer festivalCount;
    private Integer yearCount;
}