package com.magikarp.plantly_backend.quickLog.model;

import com.magikarp.plantly_backend.location.model.Location;
import com.magikarp.plantly_backend.plant.model.Plant;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupedPlants {
    private Location location;
    private List<Plant> plants;
}
