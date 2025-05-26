package com.magikarp.plantly_backend.careLog.service;

import com.magikarp.plantly_backend.careLog.model.CareLog;
import com.magikarp.plantly_backend.careLog.repository.CareLogRepository;
import com.magikarp.plantly_backend.plant.model.Plant;
import com.magikarp.plantly_backend.plant.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.time.temporal.ChronoUnit;

@Service
public class CareLogService {
    @Autowired
    private CareLogRepository careLogRepository;
    @Autowired
    private PlantRepository plantRepository;

    public CareLog getCareLogById(Integer logId, UUID userId){
        return careLogRepository.getCareLogById(logId, userId);
    }

    public List<CareLog> getCareLogsForPlant(Integer plantId, UUID userId, int page, int rows){
        Pageable pageable = PageRequest.of(page, rows, Sort.by("eventDate").descending());
        return careLogRepository.getCareLogPageByPlant(plantId, userId, pageable).getContent();
    }

    public List<CareLog> getCareLogsForUser(UUID userId, int page, int rows){
        Pageable pageable = PageRequest.of(page, rows, Sort.by("eventDate").descending());
        return careLogRepository.getCareLogByUserId(userId, pageable).getContent();
    }

    public Long getDaysSinceLastCareLog(Integer plantId, UUID userId){
        List<CareLog> logs = careLogRepository.getCareLogByPlant(plantId, userId);
        if (!logs.isEmpty()) {
            return ChronoUnit.DAYS.between(logs.getFirst().getEventDate(), LocalDate.now());
        } else {
            Plant plant = plantRepository.findPlantByUserIdAndId(userId, plantId);
            return ChronoUnit.DAYS.between(plant.getAcquired_at(), LocalDate.now());
        }
    }
}
