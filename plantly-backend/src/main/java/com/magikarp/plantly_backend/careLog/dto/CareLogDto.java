package com.magikarp.plantly_backend.careLog.dto;

import com.magikarp.plantly_backend.careLog.enums.CareEventType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CareLogDto {
    private int id;
    private CareEventType eventType;
    private LocalDateTime eventDate;
    private String notes;
}
