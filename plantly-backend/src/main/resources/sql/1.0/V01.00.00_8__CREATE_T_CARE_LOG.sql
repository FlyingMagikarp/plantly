CREATE TABLE t_care_log (
    id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES t_plant(id) ON DELETE CASCADE,
    event_type care_event_type NOT NULL,
    event_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);