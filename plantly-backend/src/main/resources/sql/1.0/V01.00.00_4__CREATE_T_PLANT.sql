CREATE TABLE public.t_plant
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    fk_species_id integer,
    fk_user_id integer,
    location character varying,
    notes character varying,
    PRIMARY KEY (id),
    CONSTRAINT FK_Species_id FOREIGN KEY (fk_species_id)
        REFERENCES public.t_species (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT FK_User_id FOREIGN KEY (fk_user_id)
        REFERENCES public.t_user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.t_plant
    OWNER to postgres;