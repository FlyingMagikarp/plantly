package com.magikarp.plantly_backend.species.service;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.care.model.CareTip;
import com.magikarp.plantly_backend.care.repository.CareTipRepository;
import com.magikarp.plantly_backend.plant.model.Plant;
import com.magikarp.plantly_backend.plant.repository.PlantRepository;
import com.magikarp.plantly_backend.species.dto.NameLcPair;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.species.model.SpeciesTranslation;
import com.magikarp.plantly_backend.species.repository.SpeciesRepository;
import com.magikarp.plantly_backend.species.repository.SpeciesTranslationRepository;
import com.magikarp.plantly_backend.util.exceptions.SpeciesInUseException;
import com.magikarp.plantly_backend.util.exceptions.SpeciesNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SpeciesAdminService {
    @Autowired
    private SpeciesRepository speciesRepository;
    @Autowired
    private SpeciesTranslationRepository speciesTranslationRepository;
    @Autowired
    private CareTipRepository careTipRepository;
    @Autowired
    private PlantRepository plantRepository;

    public void updateSpeciesNames(Integer speciesId, String latinName, List<NameLcPair> commonNames) throws SpeciesNotFoundException {
        Optional<Species> species = speciesRepository.findById(speciesId);

        if (species.isEmpty()) {
            throw new SpeciesNotFoundException("Species not found: " + speciesId);
        }

        species.get().setLatin_name(latinName);
        speciesRepository.save(species.get());

        commonNames.forEach(np -> {
            SpeciesTranslation st = speciesTranslationRepository.findSpeciesTranslationBySpeciesIdAndLanguageCode(speciesId, np.getLc().toUpperCase());
            if(st == null){
                st = new SpeciesTranslation();
                st.setSpecies(species.get());
                st.setLanguageCode(np.getLc());
            }
            st.setCommonName(np.getCommonName());
            speciesTranslationRepository.save(st);
        });
    }

    public void addSpecies(String latinName, List<NameLcPair> commonNames){
        Species species = new Species();
        species.setLatin_name(latinName);

        Species s = speciesRepository.save(species);
        commonNames.forEach(np -> {
            SpeciesTranslation st = new SpeciesTranslation();
            st.setSpecies(s);
            st.setLanguageCode(np.getLc());
            st.setCommonName(np.getCommonName());
            speciesTranslationRepository.save(st);
        });
    }

    public void updateSpeciesCareTips(Integer speciesId, CareTipDto dto) throws SpeciesNotFoundException {
        CareTip careTip = careTipRepository.findCareTipForSpecies(speciesId);
        if (careTip == null) {
            careTip = new CareTip();
            Species species = speciesRepository.findById(speciesId).get();
            careTip.setSpecies(species);
        }

        careTip.setPlacement(dto.getPlacement());
        careTip.setWinterHardy(dto.isWinterHardy());
        careTip.setOptimalTempMinC(dto.getOptimalTempMinC());
        careTip.setOptimalTempMaxC(dto.getOptimalTempMaxC());
        careTip.setWateringFrequencyDays(dto.getWateringFrequencyDays());
        careTip.setWateringNotes(dto.getWateringNotes());
        careTip.setFertilizingFrequencyDays(dto.getFertilizingFrequencyDays());
        careTip.setFertilizingType(dto.getFertilizingType());
        careTip.setFertilizingNotes(dto.getFertilizingNotes());
        careTip.setRepottingCycleMonths(dto.getRepottingCycleMonths());
        careTip.setGrowingSeasonStart(dto.getGrowingSeasonStart());
        careTip.setGrowingSeasonEnd(dto.getGrowingSeasonEnd());
        careTip.setDormantSeasonStart(dto.getDormantSeasonStart());
        careTip.setDormantSeasonEnd(dto.getDormantSeasonEnd());
        careTip.setPruningNotes(dto.getPruningNotes());
        careTip.setPruningMonths(dto.getPruningMonths());
        careTip.setWiringNotes(dto.getWiringNotes());
        careTip.setWiringMonths(dto.getWiringMonths());
        careTip.setPropagationNotes(dto.getPropagationNotes());
        careTip.setPropagationMonths(dto.getPropagationMonths());
        careTip.setPests(dto.getPests());
        careTip.setNotes(dto.getNotes());
        careTip.setSoil(dto.getSoil());

        careTipRepository.save(careTip);
    }

    public void removeSpecies(Integer speciesId) throws SpeciesNotFoundException, SpeciesInUseException {
        Optional<Species> species = speciesRepository.findById(speciesId);
        if (species.isEmpty()) {
            throw new SpeciesNotFoundException("Species not found: " + speciesId);
        }

        if (checkIfSpeciesIsInUse(speciesId)) {
            throw new SpeciesInUseException("Species is still in use!");
        }

        removeSpeciesTranslations(speciesId);
        removeCareTip(speciesId);

        speciesRepository.delete(species.get());
    }

    public boolean checkIfSpeciesIsInUse(Integer speciesId){
        List<Plant> plants = plantRepository.findPlantsBySpecies(speciesId);
        return !plants.isEmpty();
    }

    public void removeSpeciesTranslations(Integer speciesId) {
        List<SpeciesTranslation> st = speciesTranslationRepository.findSpeciesTranslationBySpeciesId(speciesId);

        if (!st.isEmpty()){
            speciesTranslationRepository.deleteAll(st);
        }
    }

    public void removeCareTip(Integer speciesId){
        CareTip careTip = careTipRepository.findCareTipForSpecies(speciesId);
        if (careTip != null) {
            careTipRepository.delete(careTip);
        }
    }

}
