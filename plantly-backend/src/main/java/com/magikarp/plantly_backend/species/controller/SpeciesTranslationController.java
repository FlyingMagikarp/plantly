package com.magikarp.plantly_backend.species.controller;

import com.magikarp.plantly_backend.species.dto.SpeciesOverviewDto;
import com.magikarp.plantly_backend.species.mapper.SpeciesMapper;
import com.magikarp.plantly_backend.species.service.SpeciesTranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sec/speciesTranslation")
public class SpeciesTranslationController {
    @Autowired
    private SpeciesTranslationService speciesTranslationService;

    @GetMapping("/{speciesId}")
    public List<SpeciesOverviewDto> getSpeciesTranslation(@PathVariable Integer speciesId) {
        return speciesTranslationService.getSpeciesTranslation(speciesId).stream().map(SpeciesMapper::mapSpeciesTranslationToDto).collect(Collectors.toList());
    }
}
