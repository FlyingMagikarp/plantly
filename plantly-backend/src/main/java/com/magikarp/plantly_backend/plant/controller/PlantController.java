package com.magikarp.plantly_backend.plant.controller;

import com.magikarp.plantly_backend.plant.model.Plant;
import com.magikarp.plantly_backend.plant.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sec/plant")
public class PlantController {
    @Autowired
    private PlantService plantService;

    @GetMapping
    public void getAllPlants(){

    }

    @GetMapping("{plantId}")
    public void getPlant(@PathVariable Integer plantId){

    }

    @PostMapping
    public void updatePlant(@RequestBody Plant plant){

    }

    @DeleteMapping("{plantId}")
    public void deletePlant(@PathVariable Integer plantId){

    }

}
