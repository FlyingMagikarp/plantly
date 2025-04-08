CREATE TABLE public.t_location
(
    id serial NOT NULL,
    name text NOT NULL,
    description text,
    user_id uuid NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT "FK_location_user" FOREIGN KEY (user_id)
        REFERENCES public.t_user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.t_location
    OWNER to postgres;