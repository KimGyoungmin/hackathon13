package com.example.hackerton.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 축제 지역 정보를 담는 도메인 클래스
 * 시/군 필터링에 사용됩니다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private Long locationId;        // 지역 ID
    private String locationNm;      // 지역 시/군명
}
