package com.magikarp.plantly_backend.plant.mapper;

import com.magikarp.plantly_backend.plant.dto.PlantDto;
import com.magikarp.plantly_backend.plant.model.Plant;

public class PlantMapper {
    public static PlantDto mapPlantToDto(Plant plant) {
        PlantDto dto = new PlantDto();
        dto.setId(plant.getId());
        dto.setSpeciesId(plant.getSpecies().getId());
        dto.setSpeciesLatinName(plant.getSpecies().getLatin_name());
        dto.setNickname(plant.getNickname());
        dto.setAcquiredAt(plant.getAcquired_at());
        dto.setLocationId(plant.getLocation().getId());
        dto.setLocationName(plant.getLocation().getName());
        dto.setNotes(plant.getNotes());
        dto.setRemoved(plant.isRemoved());
        dto.setDied(plant.isDied());
        dto.setRemoved(plant.isRemoved());
        dto.setInactiveReason(plant.getInactiveReason());
        dto.setInactiveDate(plant.getInactiveDate());
        dto.setCheckFreq(plant.getCheckFreq());

        return dto;
    }
}
