package com.magikarp.plantly_backend.fertilizer.mapper;

import com.magikarp.plantly_backend.fertilizer.dto.FertilizerApplicationDto;
import com.magikarp.plantly_backend.fertilizer.dto.FertilizerDto;
import com.magikarp.plantly_backend.fertilizer.model.Fertilizer;
import com.magikarp.plantly_backend.fertilizer.model.FertilizerApplication;

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

    public static FertilizerApplicationDto mapFertilizerApplicationToDto(FertilizerApplication fertApp){
        FertilizerApplicationDto dto = new FertilizerApplicationDto();
        dto.setId(fertApp.getId());
        dto.setFertilizerId(fertApp.getFertilizer().getId());
        dto.setName(fertApp.getFertilizer().getName());
        dto.setNPercentage(fertApp.getFertilizer().getNPercentage());
        dto.setPPercentage(fertApp.getFertilizer().getPPercentage());
        dto.setKPercentage(fertApp.getFertilizer().getKPercentage());
        dto.setText(fertApp.getFertilizer().getText());
        dto.setAmount_ml(fertApp.getAmount_ml());
        dto.setDilutionRatio(fertApp.getDilutionRatio());

        return dto;
    }
}
