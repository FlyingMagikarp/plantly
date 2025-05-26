package com.magikarp.plantly_backend.careLog.repository;

import com.magikarp.plantly_backend.careLog.model.CareLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface CareLogRepository extends JpaRepository<CareLog, Integer> {
    @Query("select cl from CareLog cl where cl.id = ?1 and cl.plant.user.id = ?2")
    public CareLog getCareLogById(Integer careLogId, UUID userId);

    @Query("select cl from CareLog cl where cl.plant.id = ?1 and cl.plant.user.id = ?2 order by cl.eventType desc")
    public List<CareLog> getCareLogByPlant(Integer plantId, UUID userId);

    @Query("select cl from CareLog cl where cl.plant.id = ?1 and cl.plant.user.id = ?2 order by cl.eventType desc")
    public Page<CareLog> getCareLogPageByPlant(Integer plantId, UUID userId, Pageable pageable);

    @Query("select cl from CareLog cl where cl.plant.user.id = ?1")
    public Page<CareLog> getCareLogByUserId(UUID userId, Pageable pageable);
}
