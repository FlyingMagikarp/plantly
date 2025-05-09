package com.magikarp.plantly_backend.species.service;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.care.model.CareTip;
import com.magikarp.plantly_backend.care.repository.CareTipRepository;
import com.magikarp.plantly_backend.species.dto.NameLcPair;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.species.model.SpeciesTranslation;
import com.magikarp.plantly_backend.species.repository.SpeciesRepository;
import com.magikarp.plantly_backend.species.repository.SpeciesTranslationRepository;
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

    public void updateSpeciesCareTips(Integer speciesId, CareTipDto dto) throws SpeciesNotFoundException {
        CareTip careTip = careTipRepository.findCareTipForSpecies(speciesId);
        if (careTip == null) {
            throw new SpeciesNotFoundException("Species not found: " + speciesId);
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

}
