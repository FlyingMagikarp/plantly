package com.magikarp.plantly_backend.location.service;

import com.magikarp.plantly_backend.location.dto.LocationDto;
import com.magikarp.plantly_backend.location.model.Location;
import com.magikarp.plantly_backend.location.repository.LocationRepository;
import com.magikarp.plantly_backend.plant.repository.PlantRepository;
import com.magikarp.plantly_backend.user.UserRepository;
import com.magikarp.plantly_backend.util.exceptions.LocationInUseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private PlantRepository plantRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Location> getAllLocations(UUID userId) {
        return locationRepository.findByUser(userId);
    }

    public Location getLocation(UUID userId, Integer locationId) {
        return locationRepository.findByUserAndId(userId, locationId);
    }

    public void deleteLocation(UUID userId, Integer locationId) throws LocationInUseException {
        if (isLocationInUse(locationId)){
            Location location = getLocation(userId, locationId);
            locationRepository.delete(location);
        } else {
            throw new LocationInUseException("Location is in use: " + locationId);
        }
    }

    public void updateLocation(UUID userId, LocationDto dto){
        Location loc = getLocation(userId, dto.getId());
        if (loc == null){
            loc = new Location();
            loc.setUser(userRepository.findById(userId).get());
        }

        loc.setName(dto.getName());
        loc.setDescription(dto.getDescription());

        locationRepository.save(loc);
    }

    private boolean isLocationInUse(Integer locationId) {
        return plantRepository.findByLocationId(locationId) != null;
    }
}
