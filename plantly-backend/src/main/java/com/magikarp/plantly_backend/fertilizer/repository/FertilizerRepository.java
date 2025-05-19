package com.magikarp.plantly_backend.fertilizer.repository;

import com.magikarp.plantly_backend.fertilizer.model.Fertilizer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FertilizerRepository extends JpaRepository<Fertilizer, Integer> {
}
