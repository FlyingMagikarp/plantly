package com.magikarp.plantly_backend.care.model;

import com.magikarp.plantly_backend.care.enums.CareEventType;
import com.magikarp.plantly_backend.plant.model.Plant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_care_log")
public class CareLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="plant_id", referencedColumnName = "id")
    private Plant plant;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", columnDefinition = "care_event_type", nullable = false)
    private CareEventType eventType;

    private LocalDateTime eventDate;
    private String notes;
}
