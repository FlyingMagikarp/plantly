package com.magikarp.plantly_backend.species.dto;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SpeciesUpdateCareTipsRequestDto {
    private CareTipDto careTipDto;
}
