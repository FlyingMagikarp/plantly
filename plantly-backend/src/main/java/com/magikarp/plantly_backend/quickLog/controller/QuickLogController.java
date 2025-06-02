package com.magikarp.plantly_backend.quickLog.controller;

import com.magikarp.plantly_backend.auth.AuthService;
import com.magikarp.plantly_backend.location.dto.LocationDto;
import com.magikarp.plantly_backend.location.mapper.LocationMapper;
import com.magikarp.plantly_backend.quickLog.dto.GroupedPlantsDto;
import com.magikarp.plantly_backend.quickLog.service.QuickLogService;
import com.magikarp.plantly_backend.quickLog.mapper.QuickLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sec/quicklog")
public class QuickLogController {
    @Autowired
    private QuickLogService quickLogService;
    @Autowired
    private AuthService authService;

    @GetMapping("plants")
    public List<GroupedPlantsDto> getGroupedPlants() {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return quickLogService.getGroupedPlants(uuid).stream().map(QuickLogMapper::mapToGroupedPlantsDto).collect(Collectors.toList());
    }

    @GetMapping("plants/{locId}")
    public GroupedPlantsDto getGroupedPlantsForLocation(@PathVariable Integer locId) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return QuickLogMapper.mapToGroupedPlantsDto(quickLogService.getGroupedPlantsForLocation(uuid, locId));
    }

        @GetMapping("locations")
    public List<LocationDto> getNonEmptyLocations() {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return quickLogService.getNonEmptyLocations(uuid).stream().map(LocationMapper::mapLocationToDto).collect(Collectors.toList());
    }
}
