CREATE TABLE public."t_plant"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "FK_species_id" integer,
    "FK_user_id" uuid,
    location character varying,
    notes character varying,
    PRIMARY KEY (id),
    CONSTRAINT "FK_Species_id" FOREIGN KEY ("FK_species_id")
        REFERENCES public."T_SPECIES" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "FK_User_id" FOREIGN KEY ("FK_user_id")
        REFERENCES public.t_user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public."T_PLANT"
    OWNER to postgres;