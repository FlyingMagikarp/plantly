package com.magikarp.plantly_backend.plant.service;

import com.magikarp.plantly_backend.careLog.enums.CareEventType;
import com.magikarp.plantly_backend.careLog.model.CareLog;
import com.magikarp.plantly_backend.careLog.repository.CareLogRepository;
import com.magikarp.plantly_backend.location.repository.LocationRepository;
import com.magikarp.plantly_backend.plant.dto.PlantDto;
import com.magikarp.plantly_backend.plant.model.Plant;
import com.magikarp.plantly_backend.plant.repository.PlantRepository;
import com.magikarp.plantly_backend.species.repository.SpeciesRepository;
import com.magikarp.plantly_backend.user.UserRepository;
import com.magikarp.plantly_backend.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlantService {
    @Autowired
    private PlantRepository plantRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SpeciesRepository speciesRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private CareLogRepository careLogRepository;

    public List<Plant> getAllPlants(UUID userId) {
        return plantRepository.findPlantsByUserId(userId);
    }

    public Plant getPlantById(UUID userId, Integer plantId) {
        return plantRepository.findPlantByUserIdAndId(userId, plantId);
    }

    public void deletePlantById(UUID userId, Integer plantId) {
        Plant plant = getPlantById(userId, plantId);
        if (plant != null) {
            plantRepository.delete(plant);
        }
    }

    public void updatePlantFromDto(UUID userId, PlantDto dto) {
        Plant plant = getPlantById(userId, dto.getId());
        if (plant == null) {
            plant = new Plant();
            plant.setUser(userRepository.findById(userId).get());
        }

        plant.setSpecies(speciesRepository.findById(dto.getSpeciesId()).get());
        plant.setNickname(dto.getNickname());
        plant.setAcquired_at(dto.getAcquiredAt());
        plant.setLocation(locationRepository.findByUserAndId(userId, dto.getLocationId()));
        plant.setNotes(dto.getNotes());

        if (dto.isRemoved() && !plant.isRemoved()){
            CareLog cl = new CareLog();
            cl.setEventDate(LocalDate.now());
            cl.setPlant(plant);
            cl.setEventType(CareEventType.removed);
            cl.setNotes("Plant removed");

            careLogRepository.save(cl);
        }

        plant.setRemoved(dto.isRemoved());
        plant.setDied(dto.isDied());
        plant.setInactiveReason(dto.getInactiveReason());
        plant.setInactiveDate(dto.getInactiveDate());
        plant.setCheckFreq(dto.getCheckFreq());

        plantRepository.save(plant);

        if (dto.getId() < 1){
            CareLog cl = new CareLog();
            cl.setEventDate(dto.getAcquiredAt());
            cl.setPlant(plant);
            cl.setEventType(CareEventType.acquired);
            cl.setNotes("Plant acquired");

            careLogRepository.save(cl);
        }

    }
}
