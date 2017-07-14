

CREATE TABLE IF NOT EXISTS cd_organisations (
  id character varying NOT NULL,
  name character varying NOT NULL,
  created_at timestamp with time zone,
  created_by character varying,
  CONSTRAINT pk_cd_organisations_id PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS cd_user_org (
  id character varying NOT NULL,
  user_id character varying,
  org_id character varying,
  CONSTRAINT pk_cd_userorg PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);

CREATE OR REPLACE FUNCTION wait_user_table() RETURNS VOID AS $$
DECLARE
  counted NUMERIC;
BEGIN
  SELECT count(*)
    FROM information_schema.tables INTO counted
    WHERE table_name = 'cd_user_profile';
  RAISE NOTICE 'Counter(%)', counted;
  IF counted > 0 THEN
    CREATE OR REPLACE VIEW cd_v_user_org AS
      SELECT up.user_id as user_id, up.name as username, user_type, o.id as org_id, o.name as org_name
      FROM cd_user_org uo
      JOIN cd_organisations o ON uo.org_id = o.id
      JOIN cd_user_profile up ON uo.user_id = up.user_id;
  ELSE
    PERFORM pg_sleep(1);
    RAISE NOTICE 'Slept';
	  PERFORM wait_user_table();
  END IF;
END; $$ LANGUAGE 'plpgsql';

SELECT wait_user_table();
