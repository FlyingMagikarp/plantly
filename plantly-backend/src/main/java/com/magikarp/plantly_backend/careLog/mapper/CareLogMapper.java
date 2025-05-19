package com.magikarp.plantly_backend.careLog.mapper;

import com.magikarp.plantly_backend.careLog.dto.CareLogDto;
import com.magikarp.plantly_backend.careLog.model.CareLog;

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
