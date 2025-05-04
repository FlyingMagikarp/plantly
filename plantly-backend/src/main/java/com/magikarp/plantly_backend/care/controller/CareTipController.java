package com.magikarp.plantly_backend.care.controller;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.care.mapper.CareMapper;
import com.magikarp.plantly_backend.care.repository.CareTipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sec/caretip")
public class CareTipController {
    @Autowired
    private CareTipRepository careTipRepository;

    @GetMapping("/{speciesId}")
    public CareTipDto getCareTip(@PathVariable Integer speciesId) {
        return CareMapper.mapCareTipToDto(careTipRepository.findCareTipForSpecies(speciesId));
    }
}
