package com.example.hackerton.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalDetail {
    private Long festivalId;
    private String festivalName;             // 축제명 추가
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
    private Double trafficCongestion;  // 교통접근성지수
    private Integer field;         // 지역인구수
    private Double grdpPerCapitaMkrw;       // 지역_1인당GRDP
    private Integer programCount;            // 프로그램수
    private Double promoIntensityIndex;      // 홍보강도지수
    private Long budgetKrw;                  // 축제예산 (Long으로 변경)
    private Integer year;                    // 개최년도
    private Long grossSales;                 // 총매출 (Long으로 변경)

}
