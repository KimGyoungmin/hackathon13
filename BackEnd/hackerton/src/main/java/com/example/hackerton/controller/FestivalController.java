package com.example.hackerton.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.service.FestivalService;


@RestController
@RequestMapping("/api/festivals")
public class FestivalController {
    
    @Autowired
    private FestivalService festivalService;

    @GetMapping
    public List<Festival> getFestivals() {
        return festivalService.getAllFestivals(); // Entity 직접 반환
    }
}
