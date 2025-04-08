package com.magikarp.plantly_backend.care.model;

import com.magikarp.plantly_backend.care.enums.PlacementType;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.util.IntegerArrayConverter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

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
    private BigDecimal optimalTempMinC;
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

    @Convert(converter = IntegerArrayConverter.class)
    @Column(name = "pruning_months")
    private List<Integer> pruningMonths;

    private String wiringNotes;

    @Convert(converter = IntegerArrayConverter.class)
    @Column(name = "wiring_months")
    private List<Integer> wiringMonths;

    private String propagationNotes;

    @Convert(converter = IntegerArrayConverter.class)
    @Column(name = "propagation_months")
    private List<Integer> propagationMonths;

    private String pests;
    private String notes;
}
