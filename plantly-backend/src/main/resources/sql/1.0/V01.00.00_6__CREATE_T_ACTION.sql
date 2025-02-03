CREATE TABLE public.t_action
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    fk_plant_id integer,
    fk_action_type_id integer,
    date date,
    note character varying,
    PRIMARY KEY (id),
    CONSTRAINT fk_plant_id FOREIGN KEY (fk_plant_id)
        REFERENCES public.t_plant (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_action_type_id FOREIGN KEY (fk_action_type_id)
        REFERENCES public.t_action_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.t_action
    OWNER to postgres;