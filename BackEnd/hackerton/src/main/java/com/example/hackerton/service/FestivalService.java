package com.example.hackerton.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hackerton.domain.Festival;
import com.example.hackerton.mapper.FestivalMapper;

@Service
public class FestivalService {

    @Autowired
    private FestivalMapper festivalMapper;

    public List<Festival> getAllFestivals() {
        return festivalMapper.findAll();
    }
    // Entity 직접 사용
}
