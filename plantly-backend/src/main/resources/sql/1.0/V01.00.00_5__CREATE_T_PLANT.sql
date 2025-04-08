CREATE TABLE t_plant (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES  t_user(id) ON DELETE NO ACTION,
    species_id INTEGER REFERENCES t_species(id) ON DELETE SET NULL,
    nickname TEXT,
    acquired_at DATE,
    location_id INTEGER REFERENCES t_location(id) ON DELETE SET NULL,
    notes TEXT
);