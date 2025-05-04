package com.magikarp.plantly_backend.care.model;

import com.magikarp.plantly_backend.care.enums.PlacementType;
import com.magikarp.plantly_backend.species.model.Species;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_care_tip")
public class CareTip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="species_id", referencedColumnName = "id")
    private Species species;

    @Enumerated(EnumType.STRING)
    @Column(name = "placement", columnDefinition = "placement_type", nullable = false)
    private PlacementType placement;

    private boolean winterHardy;
    @Column(name = "optimal_temp_min_c")
    private BigDecimal optimalTempMinC;
    @Column(name = "optimal_temp_max_c")
    private BigDecimal optimalTempMaxC;
    private int wateringFrequencyDays;
    private String wateringNotes;
    private int fertilizingFrequencyDays;
    private String fertilizingType;
    private String fertilizingNotes;
    private int repottingCycleMonths;
    private int growingSeasonStart;
    private int growingSeasonEnd;
    private int dormantSeasonStart;
    private int dormantSeasonEnd;
    private String pruningNotes;

    @Column(name = "pruning_months", columnDefinition = "integer[]")
    private Integer[] pruningMonths;

    private String wiringNotes;

    @Column(name = "wiring_months", columnDefinition = "integer[]")
    private Integer[] wiringMonths;

    private String propagationNotes;

    @Column(name = "propagation_months", columnDefinition = "integer[]")
    private Integer[] propagationMonths;

    private String pests;
    private String notes;
}
