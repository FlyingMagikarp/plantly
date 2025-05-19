package com.magikarp.plantly_backend.care.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class FertilizerDto {
    private Integer id;
    private String name;
    private BigDecimal nPercentage;
    private BigDecimal pPercentage;
    private BigDecimal kPercentage;
    private String text;
}
