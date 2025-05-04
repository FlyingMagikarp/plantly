package com.magikarp.plantly_backend.care.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_fertilizer_application")
public class FertilizerApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="care_log_id", referencedColumnName = "id")
    private CareLog careLog;

    @ManyToOne
    @JoinColumn(name="fertilizer_id", referencedColumnName = "id")
    private Fertilizer fertilizer;

    private BigDecimal amount_ml;
    private String dilutionRatio;
}
