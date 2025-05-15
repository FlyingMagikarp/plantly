package com.magikarp.plantly_backend.location.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateLocationsRequestDto {
    private List<LocationDto> locations;
}
