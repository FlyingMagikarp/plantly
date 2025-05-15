package com.magikarp.plantly_backend.location.mapper;

import com.magikarp.plantly_backend.location.dto.LocationDto;
import com.magikarp.plantly_backend.location.model.Location;

public class LocationMapper {
    public static LocationDto mapLocationToDto(Location loc) {
        LocationDto dto = new LocationDto();
        dto.setId(loc.getId());
        dto.setName(loc.getName());
        dto.setDescription(loc.getDescription());
        return dto;
    }
}
