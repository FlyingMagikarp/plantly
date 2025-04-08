CREATE TABLE t_care_tip (
    id SERIAL PRIMARY KEY,
    species_id INTEGER REFERENCES t_species(id) ON DELETE SET NULL,
    placement placement_type,
    winter_hardy BOOLEAN,
    optimal_temp_min_c NUMERIC(4, 1),
    optimal_temp_max_c NUMERIC(4, 1),
    watering_frequency_days INTEGER,
    watering_notes TEXT,
    fertilizing_frequency_days INTEGER,
    fertilizing_type TEXT,
    fertilizing_notes TEXT,
    repotting_cycle_months INTEGER,
    growing_season_start INTEGER, -- month number (1–12)
    growing_season_end INTEGER,
    dormant_season_start INTEGER,
    dormant_season_end INTEGER,
    pruning_notes TEXT,
    pruning_months INTEGER[], -- e.g., [3, 4, 5]
    wiring_notes TEXT,
    wiring_months INTEGER[],
    propagation_notes TEXT,
    propagation_months INTEGER[],
    pests TEXT,
    notes TEXT
);