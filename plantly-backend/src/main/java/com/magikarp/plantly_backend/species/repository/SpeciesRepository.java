package com.magikarp.plantly_backend.species.repository;

import com.magikarp.plantly_backend.species.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpeciesRepository extends JpaRepository<Species, Integer> {
}
