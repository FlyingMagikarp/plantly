package com.magikarp.plantly_backend.species.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpeciesOverviewDto {
    private Integer speciesId;
    private String commonName;
    private String latinName;
    private String lc;
}
