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
    private String festivalName;

}
