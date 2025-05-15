package com.magikarp.plantly_backend.plant.repository;

import com.magikarp.plantly_backend.plant.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PlantRepository extends JpaRepository<Plant, Integer> {
    @Query("select p from Plant p where p.species.id = ?1")
    List<Plant> findPlantsBySpecies(Integer speciesId);

    @Query("select p from Plant p where p.user.id = ?1")
    List<Plant> findPlantsByUserId(UUID userId);

    @Query("select p from Plant p where p.user.id = ?1 and p.id = ?2")
    Plant findPlantByUserIdAndId(UUID userId, Integer plantId);

    @Query("select p from Plant p where p.location.id = ?1")
    Plant findByLocationId(Integer locationId);
}
