-- Core species table: only the unique identifier and Latin name
CREATE TABLE t_species (
   id SERIAL PRIMARY KEY,
   latin_name TEXT NOT NULL UNIQUE
);

-- Translations for each species, by language
CREATE TABLE t_species_translation (
   id SERIAL PRIMARY KEY,
   species_id INTEGER NOT NULL REFERENCES t_species(id) ON DELETE CASCADE,
   language_code VARCHAR(5) NOT NULL,  -- e.g. 'en', 'de', 'fr'
   common_name TEXT NOT NULL,
   UNIQUE (species_id, language_code)
);