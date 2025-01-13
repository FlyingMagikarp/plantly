package com.magikarp.plantly_backend.action.model;

import com.magikarp.plantly_backend.species.model.Species;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_action")
public class Action {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @ManyToOne
    @JoinColumn(name="FK_species_id", referencedColumnName = "id")
    private Species FKSpeciesId;

    @ManyToOne
    @JoinColumn(name="FK_action_type_id", referencedColumnName = "id")
    private ActionType FKActionTypeId;

    private Date date;
    private String note;
}
