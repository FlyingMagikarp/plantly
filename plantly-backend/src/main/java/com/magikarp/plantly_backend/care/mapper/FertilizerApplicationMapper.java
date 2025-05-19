package com.magikarp.plantly_backend.care.mapper;

import com.magikarp.plantly_backend.care.dto.FertilizerApplicationDto;
import com.magikarp.plantly_backend.care.model.FertilizerApplication;

public class FertilizerApplicationMapper {
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
