SELECT nextval(pg_get_serial_sequence('t_species', 'id'));


SELECT setval(
               pg_get_serial_sequence('t_species', 'id'),
               (SELECT MAX(id) FROM t_species)
       );
