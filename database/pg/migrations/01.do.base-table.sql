

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
