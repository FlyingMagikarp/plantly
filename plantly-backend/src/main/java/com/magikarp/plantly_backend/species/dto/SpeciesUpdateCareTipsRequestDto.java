package com.magikarp.plantly_backend.species.dto;

import com.magikarp.plantly_backend.careTip.dto.CareTipDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpeciesUpdateCareTipsRequestDto {
    private CareTipDto careTipDto;
}
