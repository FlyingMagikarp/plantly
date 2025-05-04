package com.magikarp.plantly_backend.species.mapper;

import com.magikarp.plantly_backend.species.dto.SpeciesDto;
import com.magikarp.plantly_backend.species.dto.SpeciesOverviewDto;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.species.model.SpeciesTranslation;

public class SpeciesMapper {
    public static SpeciesOverviewDto mapSpeciesTranslationToDto(SpeciesTranslation species) {
        SpeciesOverviewDto dto = new SpeciesOverviewDto();
        dto.setSpeciesId(species.getSpecies().getId());
        dto.setCommonName(species.getCommonName());
        dto.setLatinName(species.getSpecies().getLatin_name());
        dto.setLc(species.getLanguageCode());

        return dto;
    }

    public static SpeciesDto mapSpeciesToDto(Species species) {
        SpeciesDto dto = new SpeciesDto();
        dto.setSpeciesId(species.getId());
        dto.setLatinName(species.getLatin_name());

        return dto;
    }
}
