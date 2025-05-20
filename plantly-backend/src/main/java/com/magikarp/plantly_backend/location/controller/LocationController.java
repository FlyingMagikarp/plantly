package com.magikarp.plantly_backend.location.controller;

import com.magikarp.plantly_backend.auth.AuthService;
import com.magikarp.plantly_backend.location.dto.LocationDto;
import com.magikarp.plantly_backend.location.dto.UpdateLocationsRequestDto;
import com.magikarp.plantly_backend.location.mapper.LocationMapper;
import com.magikarp.plantly_backend.location.service.LocationService;
import com.magikarp.plantly_backend.util.exceptions.LocationInUseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sec/location")
public class LocationController {
    @Autowired
    private LocationService locationService;
    @Autowired
    private AuthService authService;

    @GetMapping
    public List<LocationDto> getAllLocations() {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return locationService.getAllLocations(uuid).stream().map(LocationMapper::mapLocationToDto).collect(Collectors.toList());
    }

    @GetMapping("{locId}")
    public LocationDto getLocation(@PathVariable Integer locId) {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return LocationMapper.mapLocationToDto(locationService.getLocation(uuid, locId));
    }

    @PostMapping
    public ResponseEntity<Object> updateLocation(@RequestBody UpdateLocationsRequestDto requestDto) throws LocationInUseException {
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        locationService.updateLocations(uuid, requestDto.getLocations());
        return ResponseEntity.ok().build();
    }

}
