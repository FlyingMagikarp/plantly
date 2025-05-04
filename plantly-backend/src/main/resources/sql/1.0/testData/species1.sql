INSERT INTO public.t_species(
    id, latin_name)
VALUES (1, 'Picea Glauca');

INSERT INTO public.t_species_translation(
    id, species_id, language_code, common_name)
VALUES (1, 1, 'EN', 'White Spruce');