package com.magikarp.plantly_backend.plant.repository;

import com.magikarp.plantly_backend.plant.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlantRepository extends JpaRepository<Plant, Integer> {
    @Query("select p from Plant p where p.species.id = ?1")
    List<Plant> findPlantsBySpecies(Integer speciesId);
}
