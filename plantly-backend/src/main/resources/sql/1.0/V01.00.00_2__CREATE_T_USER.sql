CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.t_user (
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   username VARCHAR(20) NOT NULL,
   password VARCHAR(1024) NOT NULL,
   userrole VARCHAR(1024) NOT NULL
);

ALTER TABLE IF EXISTS public.t_user
    OWNER TO postgres;