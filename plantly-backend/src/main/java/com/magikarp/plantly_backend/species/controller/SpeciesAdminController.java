package com.magikarp.plantly_backend.species.controller;

import com.magikarp.plantly_backend.species.dto.SpeciesUpdateCareTipsRequestDto;
import com.magikarp.plantly_backend.species.dto.SpeciesUpdateNamesRequestDto;
import com.magikarp.plantly_backend.species.service.SpeciesAdminService;
import com.magikarp.plantly_backend.util.exceptions.SpeciesNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/species")
public class SpeciesAdminController {
    @Autowired
    private SpeciesAdminService speciesAdminService;

    @RequestMapping("updateNames/{speciesId}")
    public ResponseEntity<Object> updateNames(
            @PathVariable("speciesId") Integer speciesId,
            @RequestBody SpeciesUpdateNamesRequestDto namesRequest
    ) throws SpeciesNotFoundException {
        speciesAdminService.updateSpeciesNames(speciesId, namesRequest.getLatinName(), namesRequest.getCommonNames());
        return ResponseEntity.ok().build();
    }

    @RequestMapping("updateCareTips/{speciesId}")
    public ResponseEntity<Object> updateCareTips(
            @PathVariable("speciesId") Integer speciesId,
            @RequestBody SpeciesUpdateCareTipsRequestDto careRequest
    ) throws SpeciesNotFoundException {
        speciesAdminService.updateSpeciesCareTips(speciesId, careRequest.getCareTipDto());
        return ResponseEntity.ok().build();
    }

}
