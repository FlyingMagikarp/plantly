package com.magikarp.plantly_backend.species.service;

import com.magikarp.plantly_backend.species.model.SpeciesTranslation;
import com.magikarp.plantly_backend.species.repository.SpeciesTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpeciesTranslationService {
    @Autowired
    private SpeciesTranslationRepository speciesTranslationRepository;

    public List<SpeciesTranslation> getSpeciesTranslation(Integer speciesId) {
        return speciesTranslationRepository.findSpeciesTranslationBySpeciesId(speciesId);
    }
}
