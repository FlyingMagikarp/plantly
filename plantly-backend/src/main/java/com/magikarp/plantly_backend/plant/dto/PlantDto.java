package com.magikarp.plantly_backend.plant.dto;

import com.magikarp.plantly_backend.species.dto.SpeciesDto;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PlantDto {
    private int id;
    private SpeciesDto species;
    private String nickname;
    private LocalDateTime acquiredAt;
    private String notes;
    private boolean removed;
    private boolean died;
    private String inactiveReason;
    private LocalDateTime inactiveDate;
    private Integer checkFreq;
}
