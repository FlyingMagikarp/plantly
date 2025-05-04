package com.magikarp.plantly_backend.care.dto;

import com.magikarp.plantly_backend.care.enums.PlacementType;
import com.magikarp.plantly_backend.species.dto.SpeciesDto;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CareTipDto {
    private int id;
    private SpeciesDto species;
    private PlacementType placement;
    private boolean winterHardy;
    private BigDecimal optimalTempMinC;
    private BigDecimal optimalTempMaxC;
    private int wateringFrequencyDays;
    private String wateringNotes;
    private int fertilizingFrequencyDays;
    private String fertilizingType;
    private String fertilizingNotes;
    private int repottingCycleMonths;
    private int growingSeasonStart;
    private int growingSeasonEnd;
    private int dormantSeasonStart;
    private int dormantSeasonEnd;
    private String pruningNotes;
    private Integer[] pruningMonths;
    private String wiringNotes;
    private Integer[] wiringMonths;
    private String propagationNotes;
    private Integer[] propagationMonths;
    private String pests;
    private String notes;
}
