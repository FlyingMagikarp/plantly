package com.magikarp.plantly_backend.plant.service;

import com.magikarp.plantly_backend.plant.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlantService {
    @Autowired
    private PlantRepository plantRepository;


}
