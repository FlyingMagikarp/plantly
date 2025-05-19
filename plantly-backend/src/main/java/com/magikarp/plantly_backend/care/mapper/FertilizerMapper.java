package com.magikarp.plantly_backend.care.mapper;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.care.dto.FertilizerDto;
import com.magikarp.plantly_backend.care.model.CareTip;
import com.magikarp.plantly_backend.care.model.Fertilizer;
import com.magikarp.plantly_backend.species.mapper.SpeciesMapper;

public class FertilizerMapper {
    public static FertilizerDto mapFertilizerToDto(Fertilizer fertilizer){
        FertilizerDto dto = new FertilizerDto();
        dto.setId(fertilizer.getId());
        dto.setName(fertilizer.getName());
        dto.setNPercentage(fertilizer.getNPercentage());
        dto.setPPercentage(fertilizer.getPPercentage());
        dto.setKPercentage(fertilizer.getKPercentage());
        dto.setText(fertilizer.getText());

        return dto;
    }
}
