package com.magikarp.plantly_backend.location.repository;

import com.magikarp.plantly_backend.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, Integer> {
    @Query("select l from Location l where l.user.id = ?1")
    List<Location> findByUser(UUID userId);

    @Query("select l from Location l where l.user.id = ?1 and l.id = ?2")
    Location findByUserAndId(UUID userId, Integer locationId);
}
