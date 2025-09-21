package com.example.hackerton.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Festival {
    private Long festivalId;
    private Long categoryId;
    private Long locationId;
    private String festivalNm;
    private Integer year;
    
    // 연관 객체
    private Location location;
    private Category category;
    
    // 프론트엔드에서 사용할 필드들
    public String getName() {
        return festivalNm;
    }
    
    public Long getId() {
        return festivalId;
    }
    
    public Long getLocationId() {
        return locationId;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
}
