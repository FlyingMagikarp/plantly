package com.magikarp.plantly_backend.species.service;

import com.magikarp.plantly_backend.careTip.repository.CareTipRepository;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.species.model.SpeciesTranslation;
import com.magikarp.plantly_backend.species.repository.SpeciesRepository;
import com.magikarp.plantly_backend.species.repository.SpeciesTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpeciesService {
    @Autowired
    private SpeciesRepository speciesRepository;
    @Autowired
    private SpeciesTranslationRepository speciesTranslationRepository;
    @Autowired
    private CareTipRepository careTipRepository;

    public List<SpeciesTranslation> getAllSpeciesOverview(String languageCode) {
        return speciesTranslationRepository.findAllByLanguageCode(languageCode);
    }

    public Species getSpecies(Integer speciesId) {
        return speciesRepository.findById(speciesId).get();
    }
}
