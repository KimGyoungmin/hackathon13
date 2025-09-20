package com.example.hackerton.domain;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FestivalLog {
    private Long logId;
    private Long festivalId;
    private Double promoIncrease;            // 홍보상승량
    private Double budgetIncrease;           // 예산상승량
    private Double promoIncreaseRate;        // 홍보상승량비율
    private Double budgetIncreaseRate;       // 예산상승량비율
    private String evidenceSummary;          // 판단근거내용
    private Integer forecastRevenue;         // 예측매출
    private Integer forecastVisitors;        // 예측인원
    private LocalDateTime createDt;          // 입력날짜
    private String deleteYn;                 // 삭제_여부
}
