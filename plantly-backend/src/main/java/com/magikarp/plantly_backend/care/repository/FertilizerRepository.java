package com.magikarp.plantly_backend.care.repository;

import com.magikarp.plantly_backend.care.model.Fertilizer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FertilizerRepository extends JpaRepository<Fertilizer, Integer> {
}
