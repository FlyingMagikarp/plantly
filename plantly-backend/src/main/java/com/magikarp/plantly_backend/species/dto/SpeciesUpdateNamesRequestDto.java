package com.magikarp.plantly_backend.species.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SpeciesUpdateNamesRequestDto {
    private String latinName;
    private List<NameLcPair> commonNames;
}
