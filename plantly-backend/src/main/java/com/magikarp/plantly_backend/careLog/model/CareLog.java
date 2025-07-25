package com.magikarp.plantly_backend.careLog.model;

import com.magikarp.plantly_backend.careLog.enums.CareEventType;
import com.magikarp.plantly_backend.plant.model.Plant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.LocalDate;

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
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(name = "event_type", columnDefinition = "care_event_type", nullable = false)
    private CareEventType eventType;

    private LocalDate eventDate;
    private String notes;
}
