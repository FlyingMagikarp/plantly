package com.magikarp.plantly_backend.quickLog.service;

import com.magikarp.plantly_backend.careLog.service.CareLogService;
import com.magikarp.plantly_backend.location.model.Location;
import com.magikarp.plantly_backend.location.repository.LocationRepository;
import com.magikarp.plantly_backend.plant.model.Plant;
import com.magikarp.plantly_backend.plant.repository.PlantRepository;
import com.magikarp.plantly_backend.quickLog.model.GroupedPlants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuickLogService {
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private PlantRepository plantRepository;
    @Autowired
    private CareLogService careLogService;

    public List<Location> getNonEmptyLocations(UUID userId){
        return locationRepository.findLocationsWithPlants(userId);
    }

    public List<GroupedPlants> getGroupedPlants(UUID userId){
        List<Plant> plants = plantRepository.findPlantsByUserId(userId);
        plants = plants.stream().filter(p -> careLogService.getDaysSinceLastCareLog(p.getId(), userId) > p.getCheckFreq()).collect(Collectors.toList());
        return groupPlantsByLocation(plants);
    }

    public GroupedPlants getGroupedPlantsForLocation(UUID userId, Integer locId) {
        List<Plant> plants = plantRepository.findByLocationIdAndUser(locId, userId);
        return groupPlantsByLocation(plants).getFirst();
    }

    private List<GroupedPlants> groupPlantsByLocation(List<Plant> plants) {
        return plants.stream()
                .collect(Collectors.groupingBy(Plant::getLocation))
                .entrySet().stream()
                .map(entry -> {
                    GroupedPlants groupedPlants = new GroupedPlants();
                    groupedPlants.setLocation(entry.getKey());
                    groupedPlants.setPlants(entry.getValue());
                    return groupedPlants;
                })
                .collect(Collectors.toList());
    }

}
