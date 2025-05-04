package com.magikarp.plantly_backend.care.mapper;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.care.model.CareTip;

public class CareMapper {
    public static CareTipDto mapCareTipToDto(CareTip careTip){
        CareTipDto dto = new CareTipDto();
        dto.setId(careTip.getId());
        dto.setSpecies(careTip.getSpecies());
        dto.setPlacement(careTip.getPlacement());
        dto.setWinterHardy(careTip.isWinterHardy());
        dto.setOptimalTempMinC(careTip.getOptimalTempMinC());
        dto.setOptimalTempMaxC(careTip.getOptimalTempMaxC());
        dto.setWateringFrequencyDays(careTip.getWateringFrequencyDays());
        dto.setWateringNotes(careTip.getWateringNotes());
        dto.setFertilizingFrequencyDays(careTip.getFertilizingFrequencyDays());
        dto.setFertilizingType(careTip.getFertilizingType());
        dto.setFertilizingNotes(careTip.getFertilizingNotes());
        dto.setRepottingCycleMonths(careTip.getRepottingCycleMonths());
        dto.setGrowingSeasonStart(careTip.getGrowingSeasonStart());
        dto.setGrowingSeasonEnd(careTip.getGrowingSeasonEnd());
        dto.setDormantSeasonStart(careTip.getDormantSeasonStart());
        dto.setDormantSeasonEnd(careTip.getDormantSeasonEnd());
        dto.setPruningNotes(careTip.getPruningNotes());
        dto.setPruningMonths(careTip.getPruningMonths());
        dto.setWiringNotes(careTip.getWiringNotes());
        dto.setWiringMonths(careTip.getWiringMonths());
        dto.setPropagationNotes(careTip.getPropagationNotes());
        dto.setPropagationMonths(careTip.getPropagationMonths());
        dto.setPests(careTip.getPests());
        dto.setNotes(careTip.getNotes());


        return dto;
    }
}
