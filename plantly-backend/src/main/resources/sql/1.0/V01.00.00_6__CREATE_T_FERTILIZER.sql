CREATE TABLE t_fertilizer (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES  t_user(id) ON DELETE NO ACTION,
    name TEXT NOT NULL,
    n_percentage NUMERIC(5, 2),
    p_percentage NUMERIC(5, 2),
    k_percentage NUMERIC(5, 2),
    notes TEXT
);