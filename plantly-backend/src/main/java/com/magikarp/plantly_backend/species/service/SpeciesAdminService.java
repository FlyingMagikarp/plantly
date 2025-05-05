package com.magikarp.plantly_backend.species.service;

import com.magikarp.plantly_backend.care.dto.CareTipDto;
import com.magikarp.plantly_backend.species.dto.NameLcPair;
import com.magikarp.plantly_backend.species.model.Species;
import com.magikarp.plantly_backend.species.model.SpeciesTranslation;
import com.magikarp.plantly_backend.species.repository.SpeciesRepository;
import com.magikarp.plantly_backend.species.repository.SpeciesTranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpeciesAdminService {
    @Autowired
    private SpeciesRepository speciesRepository;
    @Autowired
    private SpeciesTranslationRepository speciesTranslationRepository;

    public void updateSpeciesNames(Integer speciesId, String latinName, List<NameLcPair> commonNames){
        Species species = speciesRepository.findById(speciesId).get();

        species.setLatin_name(latinName);
        speciesRepository.save(species);

        commonNames.forEach(np -> {
            SpeciesTranslation st = speciesTranslationRepository.findSpeciesTranslationBySpeciesIdAndLanguageCode(speciesId, np.getLc().toUpperCase());
            if(st == null){
                st = new SpeciesTranslation();
                st.setSpecies(species);
                st.setLanguageCode(np.getLc());
            }
            st.setCommonName(np.getCommonName());
            speciesTranslationRepository.save(st);
        });
    }

    public void updateSpeciesCareTips(Integer speciesId, CareTipDto careTipDto) {

    }

}
