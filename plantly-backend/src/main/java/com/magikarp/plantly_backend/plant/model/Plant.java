package com.magikarp.plantly_backend.plant.model;

import com.magikarp.plantly_backend.location.model.Location;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.user.model.User;
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
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Getter
@Setter
@Entity
@Table(name="t_plant")
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne
    @JoinColumn(name="species_id", referencedColumnName = "id")
    private Species species;

    private String nickname;
    private LocalDateTime acquired_at;

    @ManyToOne
    @JoinColumn(name="location_id", referencedColumnName = "id")
    private Location location;

    private String notes;

    private boolean removed;
    private boolean died;
    private String inactiveReason;
    private LocalDateTime inactiveDate;
}
