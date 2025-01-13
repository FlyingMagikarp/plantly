CREATE TABLE public."t_species"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    latin_name character varying,
    common_en character varying,
    common_de character varying,
    placement character varying,
    type character varying,
    winter_temp integer,
    winter_hardy boolean,
    watering character varying,
    season0 character varying,
    season1 character varying,
    season2 character varying,
    season3 character varying,
    fertilizing character varying,
    pruning character varying,
    wiring character varying,
    propagation character varying,
    notes character varying,
    PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public."T_SPECIES"
    OWNER to postgres;