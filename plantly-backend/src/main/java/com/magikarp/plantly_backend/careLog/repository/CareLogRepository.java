package com.magikarp.plantly_backend.careLog.repository;

import com.magikarp.plantly_backend.careLog.model.CareLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareLogRepository extends JpaRepository<CareLog, Integer> {
}
