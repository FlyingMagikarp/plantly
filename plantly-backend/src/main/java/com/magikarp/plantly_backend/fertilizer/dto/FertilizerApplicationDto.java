package com.magikarp.plantly_backend.fertilizer.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FertilizerApplicationDto {
    private int id;
    private int fertilizerId;
    private String name;
    private BigDecimal nPercentage;
    private BigDecimal pPercentage;
    private BigDecimal kPercentage;
    private String text;
    private BigDecimal amount_ml;
    private String dilutionRatio;
}
