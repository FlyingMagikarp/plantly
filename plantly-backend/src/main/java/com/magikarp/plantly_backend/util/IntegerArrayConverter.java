package com.magikarp.plantly_backend.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class IntegerArrayConverter implements AttributeConverter<List<Integer>, Integer[]> {

    @Override
    public Integer[] convertToDatabaseColumn(List<Integer> attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.toArray(new Integer[0]);
    }

    @Override
    public List<Integer> convertToEntityAttribute(Integer[] dbData) {
        if (dbData == null) {
            return null;
        }
        return Arrays.stream(dbData)
                .collect(Collectors.toList());
    }
}