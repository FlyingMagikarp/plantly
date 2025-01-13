CREATE TABLE public."t_user"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY,
    "name" character varying(20) NOT NULL,
    "password" character varying(1024) NOT NULL,
    PRIMARY KEY ("id")
);

ALTER TABLE IF EXISTS public."t_user"
    OWNER to postgres;