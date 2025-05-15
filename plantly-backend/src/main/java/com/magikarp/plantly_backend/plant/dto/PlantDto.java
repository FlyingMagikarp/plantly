package com.magikarp.plantly_backend.plant.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PlantDto {
    private int id;
    private int speciesId;
    private String speciesLatinName;
    private String nickname;
    private LocalDateTime acquiredAt;
    private Integer locationId;
    private String locationName;
    private String notes;
    private boolean removed;
    private boolean died;
    private String inactiveReason;
    private LocalDateTime inactiveDate;
    private Integer checkFreq;
}
