package com.magikarp.plantly_backend.care.repository;

import com.magikarp.plantly_backend.care.model.CareLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareLogRepository extends JpaRepository<CareLog, Integer> {
}
