package com.magikarp.plantly_backend.species.controller;

import com.magikarp.plantly_backend.species.dto.SpeciesDto;
import com.magikarp.plantly_backend.species.dto.SpeciesOverviewDto;
import com.magikarp.plantly_backend.species.mapper.SpeciesMapper;
import com.magikarp.plantly_backend.species.service.SpeciesService;
import com.magikarp.plantly_backend.util.PlantlyConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sec/species")
public class SpeciesController {
    @Autowired
    private SpeciesService speciesService;

    @GetMapping
    public List<SpeciesOverviewDto> getAllSpecies() {
        return speciesService.getAllSpeciesOverview(PlantlyConstants.LC_EN).stream().map(SpeciesMapper::mapSpeciesTranslationToDto).collect(Collectors.toList());
    }

    @GetMapping("/{speciesId}")
    public SpeciesDto getSpecies(@PathVariable Integer speciesId) {
        return SpeciesMapper.mapSpeciesToDto(speciesService.getSpecies(speciesId));
    }
}
