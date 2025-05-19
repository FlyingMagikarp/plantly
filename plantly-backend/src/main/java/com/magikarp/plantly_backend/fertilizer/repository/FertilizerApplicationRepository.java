package com.magikarp.plantly_backend.fertilizer.repository;

import com.magikarp.plantly_backend.fertilizer.model.FertilizerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FertilizerApplicationRepository extends JpaRepository<FertilizerApplication, Integer> {
}
