CREATE TABLE t_fertilizer_application (
                                          id SERIAL PRIMARY KEY,
                                          care_log_id INTEGER NOT NULL REFERENCES t_care_log(id) ON DELETE CASCADE,
                                          fertilizer_id INTEGER NOT NULL REFERENCES t_fertilizer(id) ON DELETE CASCADE,
                                          amount_ml NUMERIC(10, 2), -- optional
                                          dilution_ratio TEXT       -- e.g., "1:100"
);