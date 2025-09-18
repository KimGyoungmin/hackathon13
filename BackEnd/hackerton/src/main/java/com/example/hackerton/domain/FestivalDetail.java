package com.example.hackerton.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalDetail {
    private Long festivalId;
    private Integer totalVisitors;           // 전체방문자수
    private Integer avgDailyVisitors;        // 일평균방문자수
    private Integer durationDays;            // 기간일수
    private Integer weekendDays;             // 주말일수
    private Integer lodgingDays;             // 숙박일수
    private Double lodgingVisitorRatio;      // 숙박형방문객비율
    private Integer avgSpendPerDayKrw;       // 1일평균지출액
    private Double stayDaysWeight;           // 체류일수가중치
    private Double avgTempC;                 // 평균기온
    private Double totalPrecipMm;            // 강수량
    private Double sunshineHours;            // 일조시간
    private Double trafficCongestionIndex;  // 교통접근성지수
    private Integer localPopulation;         // 지역인구수
    private Double grdpPerCapitaMkrw;       // 지역_1인당GRDP
    private Integer programCount;            // 프로그램수
    private Double promoIntensityIndex;      // 홍보강도지수
    private Integer budgetKrw;               // 축제예산
    private Integer year;                    // 개최년도
    
}
