import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE etablissements (
            id VARCHAR(255) PRIMARY KEY,
            catalogue_id VARCHAR(255),
            siret VARCHAR,
            onisep_nom VARCHAR,
            onisep_url VARCHAR,
            enseigne VARCHAR,
            entreprise_raison_sociale VARCHAR,
            uai VARCHAR,
            localite VARCHAR,
            region_implantation_nom VARCHAR,
            catalogue_data JSONB,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
        );

        CREATE TABLE users (
            id VARCHAR(255) PRIMARY KEY,
            firstname VARCHAR,
            lastname VARCHAR,
            email VARCHAR UNIQUE,
            email_confirmed BOOLEAN,
            role VARCHAR,
            scope JSONB,
            status VARCHAR,
            comment TEXT,
            accepted_cgu BOOLEAN,
            confirmation_token TEXT,
            refresh_token JSONB,
            salt TEXT,
            hash TEXT
        );

        CREATE TABLE users_etablissements (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id VARCHAR(255) REFERENCES users(id),
            etablissement_id VARCHAR(255)
        );

        CREATE TABLE campagnes (
            id VARCHAR(255) PRIMARY KEY,
            nom_campagne VARCHAR,
            start_date TIMESTAMPTZ,
            end_date TIMESTAMPTZ,
            questionnaire_id VARCHAR(255),
            seats SMALLINT,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
        );

        CREATE TABLE temoignages (
            id VARCHAR(255) PRIMARY KEY,
            reponses JSONB,
            is_bot BOOLEAN,
            last_question_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ,
            deleted_at TIMESTAMPTZ
        );

        CREATE TABLE temoignages_campagnes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            temoignage_id VARCHAR(255),
            campagne_id VARCHAR(255)
        );

        CREATE TABLE questionnaires (
            id VARCHAR(255) PRIMARY KEY,
            nom VARCHAR,
            questionnaire JSONB,
            questionnaire_ui JSONB,
            is_validated BOOLEAN,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
        );

        CREATE TABLE formations (
            id VARCHAR(255) PRIMARY KEY,
            catalogue_id VARCHAR(255),
            region VARCHAR,
            num_departement VARCHAR,
            intitule_long VARCHAR,
            intitule_court VARCHAR,
            diplome VARCHAR,
            localite VARCHAR,
            tags JSONB,
            lieu_formation_adresse VARCHAR,
            lieu_formation_adresse_computed VARCHAR,
            code_postal VARCHAR,
            duree INTEGER,
            etablissement_gestionnaire_siret VARCHAR,
            etablissement_gestionnaire_enseigne VARCHAR,
            etablissement_formateur_siret VARCHAR,
            etablissement_formateur_enseigne VARCHAR,
            etablissement_formateur_entreprise_raison_sociale VARCHAR,
            etablissement_formateur_adresse VARCHAR,
            etablissement_formateur_localite VARCHAR,
            catalogue_data JSONB,
            etablissement_id VARCHAR(255) REFERENCES etablissements(id),
            campagne_id VARCHAR(255),
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
        );

        CREATE TABLE verbatims (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            temoignage_id VARCHAR(255),
            question_key VARCHAR,
            content TEXT,
            status VARCHAR,
            scores JSONB,
            themes JSONB,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ,
            updated_at TIMESTAMPTZ
        );
    `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
          DROP TABLE IF EXISTS verbatims;
          DROP TABLE IF EXISTS formations;
          DROP TABLE IF EXISTS questionnaires;
          DROP TABLE IF EXISTS temoignages_campagnes;
          DROP TABLE IF EXISTS temoignages;
          DROP TABLE IF EXISTS campagnes;
          DROP TABLE IF EXISTS users_etablissements;
          DROP TABLE IF EXISTS users;
          DROP TABLE IF EXISTS etablissements;
      `.compile(db)
  );
};
