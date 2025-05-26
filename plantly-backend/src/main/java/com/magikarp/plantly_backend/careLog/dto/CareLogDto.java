package com.magikarp.plantly_backend.careLog.dto;

import com.magikarp.plantly_backend.careLog.enums.CareEventType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CareLogDto {
    private int id;
    private int plantId;
    private String plantNickname;
    private String plantSpecies;
    private String plantLocation;
    private CareEventType eventType;
    private LocalDate eventDate;
    private String notes;
}
