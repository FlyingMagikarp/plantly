package com.magikarp.plantly_backend.quickLog.mapper;

import com.magikarp.plantly_backend.plant.mapper.PlantMapper;
import com.magikarp.plantly_backend.quickLog.dto.GroupedPlantsDto;
import com.magikarp.plantly_backend.quickLog.model.GroupedPlants;

import java.util.stream.Collectors;

public class QuickLogMapper {
    public static GroupedPlantsDto mapToGroupedPlantsDto(GroupedPlants groupedPlants) {
        GroupedPlantsDto dto = new GroupedPlantsDto();
        dto.setLocationId(groupedPlants.getLocation().getId());
        dto.setLocationName(groupedPlants.getLocation().getName());
        dto.setPlantCount(groupedPlants.getPlants().size());
        dto.setPlants(groupedPlants.getPlants().stream().map(PlantMapper::mapPlantToDto).collect(Collectors.toList()));
        return dto;
    }
}
