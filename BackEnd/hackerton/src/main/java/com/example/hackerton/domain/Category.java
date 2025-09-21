package com.example.hackerton.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    private Long categoryId;
    private String categoryName;
    
    // 프론트엔드에서 사용할 필드들
    public Long getId() {
        return categoryId;
    }
    
    public String getName() {
        return categoryName;
    }
}
