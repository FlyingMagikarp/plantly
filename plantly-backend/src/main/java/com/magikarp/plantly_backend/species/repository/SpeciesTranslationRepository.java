package com.magikarp.plantly_backend.species.repository;

import com.magikarp.plantly_backend.species.model.SpeciesTranslation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SpeciesTranslationRepository extends JpaRepository<SpeciesTranslation, Integer> {
    List<SpeciesTranslation> findAllByLanguageCode(String languageCode);

    @Query("select st from SpeciesTranslation st where st.species.id = ?1")
    List<SpeciesTranslation> findSpeciesTranslationBySpeciesId(Integer speciesId);
}
