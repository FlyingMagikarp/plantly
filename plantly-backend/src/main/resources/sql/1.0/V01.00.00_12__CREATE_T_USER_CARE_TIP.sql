CREATE TABLE t_user_care_tip (
     id SERIAL PRIMARY KEY,
     species_id INTEGER NOT NULL REFERENCES t_species(id) ON DELETE CASCADE,
     user_id UUID NOT NULL,
     submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     notes TEXT NOT NULL
);