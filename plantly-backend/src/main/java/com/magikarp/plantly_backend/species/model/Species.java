package com.magikarp.plantly_backend.species.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_species")
public class Species {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String latin_name;
    private String common_en;
    private String common_de;
    private String placement;
    private String type;
    private Integer winter_temp;
    private Boolean winter_hardy;
    private String watering;
    private String season0;
    private String season1;
    private String season2;
    private String season3;
    private String fertilizing;
    private String pruning;
    private String wiring;
    private String propagation;
    private String notes;
}
