package com.magikarp.plantly_backend.care.controller;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.care.mapper.CareMapper;
import com.magikarp.plantly_backend.care.model.CareTip;
import com.magikarp.plantly_backend.care.repository.CareTipRepository;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.species.repository.SpeciesRepository;
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
    @Autowired
    private SpeciesRepository speciesRepository;

    @GetMapping("/{speciesId}")
    public CareTipDto getCareTip(@PathVariable Integer speciesId) {
        CareTip careTip = careTipRepository.findCareTipForSpecies(speciesId);

        if (careTip == null) {
            careTip = new CareTip();
            Species species = speciesRepository.findById(speciesId).get();
            careTip.setSpecies(species);
        }

        return CareMapper.mapCareTipToDto(careTip);
    }
}
