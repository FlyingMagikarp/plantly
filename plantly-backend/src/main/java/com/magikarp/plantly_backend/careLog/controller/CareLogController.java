package com.magikarp.plantly_backend.careLog.controller;

import com.magikarp.plantly_backend.auth.AuthService;
import com.magikarp.plantly_backend.careLog.dto.CareLogDto;
import com.magikarp.plantly_backend.careLog.dto.UpdateCareLogRequestDto;
import com.magikarp.plantly_backend.careLog.mapper.CareLogMapper;
import com.magikarp.plantly_backend.careLog.service.CareLogService;
import com.magikarp.plantly_backend.util.exceptions.PlantNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sec/carelog")
public class CareLogController {
    @Autowired
    private AuthService authService;
    @Autowired
    private CareLogService careLogService;

    @GetMapping("{logId}")
    public CareLogDto getCareLog(@PathVariable Integer logId) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return CareLogMapper.mapCareLogToDto(careLogService.getCareLogById(logId, uuid));
    }

    @GetMapping("plant/{plantId}")
    public List<CareLogDto> getCareLogsForPlant(@PathVariable Integer plantId, @RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer rows) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return careLogService.getCareLogsForPlant(plantId, uuid, page, rows).stream().map(CareLogMapper::mapCareLogToDto).toList();
    }

    @GetMapping
    public List<CareLogDto> getCareLogsForUser(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer rows) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return careLogService.getCareLogsForUser(uuid, page, rows).stream().map(CareLogMapper::mapCareLogToDto).toList();
    }

    @GetMapping("plant/{plantId}/lastAgo")
    public Long getDaysSinceLastCareLog(@PathVariable Integer plantId) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return careLogService.getDaysSinceLastCareLog(plantId, uuid);
    }

    @PostMapping("plant/{plantId}")
    public ResponseEntity<Object> addCareLog(@PathVariable Integer plantId, @RequestBody UpdateCareLogRequestDto requestDto) throws PlantNotFoundException {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        careLogService.addCareLog(
                requestDto.getCareLogDto().getEventDate(),
                requestDto.getCareLogDto().getEventType(),
                plantId,
                requestDto.getCareLogDto().getNotes(),
                uuid
        );
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{logId}")
    public ResponseEntity<Object> deleteCareLog(@PathVariable Integer logId) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        careLogService.deleteCareLogById(logId, uuid);
        return ResponseEntity.ok().build();
    }
}
