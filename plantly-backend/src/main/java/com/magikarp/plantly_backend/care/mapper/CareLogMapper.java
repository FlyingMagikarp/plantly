package com.magikarp.plantly_backend.care.mapper;

import com.magikarp.plantly_backend.care.dto.CareLogDto;
import com.magikarp.plantly_backend.care.model.CareLog;

public class CareLogMapper {
    public CareLogDto mapCareLogToDto(CareLog careLog){
        CareLogDto dto = new CareLogDto();
        dto.setId(careLog.getId());
        dto.setEventType(careLog.getEventType());
        dto.setEventDate(careLog.getEventDate());
        dto.setNotes(careLog.getNotes());

        return dto;
    }
}
