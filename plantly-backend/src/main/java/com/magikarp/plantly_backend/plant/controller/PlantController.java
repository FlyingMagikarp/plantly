package com.magikarp.plantly_backend.plant.controller;

import com.magikarp.plantly_backend.auth.AuthService;
import com.magikarp.plantly_backend.plant.dto.PlantDto;
import com.magikarp.plantly_backend.plant.dto.UpdatePlantRequestDto;
import com.magikarp.plantly_backend.plant.mapper.PlantMapper;
import com.magikarp.plantly_backend.plant.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sec/plant")
public class PlantController {
    @Autowired
    private PlantService plantService;
    @Autowired
    private AuthService authService;

    @GetMapping
    public List<PlantDto> getAllPlants(){
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return plantService.getAllPlants(uuid).stream().map(PlantMapper::mapPlantToDto).collect(Collectors.toList());
    }

    @GetMapping("{plantId}")
    public PlantDto getPlant(@PathVariable Integer plantId){
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        return PlantMapper.mapPlantToDto(plantService.getPlantById(uuid, plantId));
    }

    @PostMapping
    public ResponseEntity<Object> updatePlant(@RequestBody UpdatePlantRequestDto updateRequest){
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        plantService.updatePlantFromDto(uuid, updateRequest.getPlantDto());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{plantId}")
    public ResponseEntity<Object> deletePlant(@PathVariable Integer plantId){
        UUID uuid = authService.getUUIDFromUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        plantService.deletePlantById(uuid, plantId);
        return ResponseEntity.ok().build();
    }

}
