package com.magikarp.plantly_backend.quickLog.dto;

import com.magikarp.plantly_backend.plant.dto.PlantDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupedPlantsDto {
    private int locationId;
    private String locationName;
    private int plantCount;

    private List<PlantDto> plants;
}
