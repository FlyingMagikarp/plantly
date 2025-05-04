package com.magikarp.plantly_backend.care.repository;

import com.magikarp.plantly_backend.care.model.CareTip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CareTipRepository extends JpaRepository<CareTip, Integer> {
    @Query("select ct from CareTip ct where ct.species.id = ?1")
    CareTip findCareTipForSpecies(Integer speciesId);
}