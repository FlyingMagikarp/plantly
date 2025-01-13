CREATE TABLE public.t_action_type
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    name character varying,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.t_action_type
    OWNER to postgres;