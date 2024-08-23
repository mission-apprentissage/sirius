import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE etablissements (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            catalogue_id VARCHAR(255) NOT NULL,
            siret VARCHAR(14) NOT NULL,
            onisep_nom VARCHAR(255),
            onisep_url VARCHAR(255),
            enseigne VARCHAR(255),
            entreprise_raison_sociale VARCHAR(255),
            uai VARCHAR(8),
            localite VARCHAR(255),
            region_implantation_nom VARCHAR(255),
            catalogue_data JSONB NOT NULL,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            email_confirmed BOOLEAN DEFAULT FALSE,
            role VARCHAR(255) NOT NULL,
            scope JSONB,
            status VARCHAR(255) NOT NULL,
            comment TEXT,
            accepted_cgu BOOLEAN DEFAULT FALSE,
            confirmation_token TEXT,
            refresh_token JSONB,
            salt VARCHAR(64) NOT NULL,
            hash TEXT NOT NULL
        );

        CREATE TABLE users_etablissements (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) NOT NULL,
            etablissement_id UUID REFERENCES etablissements(id) NOT NULL
        );

        CREATE TABLE questionnaires (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            nom VARCHAR(255) NOT NULL,
            questionnaire JSONB  NOT NULL,
            questionnaire_ui JSONB  NOT NULL,
            is_validated BOOLEAN DEFAULT FALSE  NOT NULL,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE campagnes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            nom_campagne VARCHAR(255) NOT NULL,
            start_date TIMESTAMPTZ NOT NULL,
            end_date TIMESTAMPTZ NOT NULL,
            questionnaire_id UUID REFERENCES questionnaires(id) ON DELETE SET NULL,
            seats SMALLINT,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE temoignages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            reponses JSONB NOT NULL,
            is_bot BOOLEAN DEFAULT FALSE NOT NULL,
            last_question_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ
        );

        CREATE TABLE temoignages_campagnes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            temoignage_id UUID REFERENCES temoignages(id) NOT NULL,
            campagne_id UUID REFERENCES campagnes(id)
        );

        CREATE TABLE formations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            catalogue_id VARCHAR(255) NOT NULL,
            region VARCHAR(255) NOT NULL,
            num_departement VARCHAR(255) NOT NULL,
            intitule_long VARCHAR(255),
            intitule_court VARCHAR(255),
            diplome VARCHAR(255) NOT NULL,
            localite VARCHAR(255) NOT NULL,
            tags JSONB,
            lieu_formation_adresse VARCHAR(255),
            lieu_formation_adresse_computed VARCHAR(255),
            code_postal VARCHAR(10) NOT NULL,
            duree INTEGER NOT NULL,
            etablissement_gestionnaire_siret VARCHAR(14) NOT NULL,
            etablissement_gestionnaire_enseigne VARCHAR(255),
            etablissement_formateur_siret VARCHAR(14) NOT NULL,
            etablissement_formateur_enseigne VARCHAR(255),
            etablissement_formateur_entreprise_raison_sociale VARCHAR(255),
            etablissement_formateur_adresse VARCHAR(255),
            etablissement_formateur_localite VARCHAR(255),
            catalogue_data JSONB NOT NULL,
            etablissement_id UUID REFERENCES etablissements(id) ON DELETE SET NULL,
            campagne_id UUID REFERENCES campagnes(id) ON DELETE SET NULL,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE verbatims (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            temoignage_id UUID REFERENCES temoignages(id) NOT NULL,
            question_key VARCHAR(255) NOT NULL,
            content TEXT,
            status VARCHAR(255) NOT NULL,
            scores JSONB,
            themes JSONB,
            deleted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX idx_users_email ON users(email);
        CREATE INDEX idx_users_etablissements_user_id ON users_etablissements(user_id);
        CREATE INDEX idx_users_etablissements_etablissement_id ON users_etablissements(etablissement_id);
        CREATE INDEX idx_temoignages_campagnes_temoignage_id ON temoignages_campagnes(temoignage_id);
        CREATE INDEX idx_temoignages_campagnes_campagne_id ON temoignages_campagnes(campagne_id);
        CREATE INDEX idx_formations_etablissement_id ON formations(etablissement_id);
        CREATE INDEX idx_formations_campagne_id ON formations(campagne_id);
    `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
          ALTER TABLE campagnes DROP CONSTRAINT IF EXISTS campagnes_questionnaire_id_fkey;
          ALTER TABLE formations DROP CONSTRAINT IF EXISTS formations_campagne_id_fkey;
          ALTER TABLE formations DROP CONSTRAINT IF EXISTS formations_etablissement_id_fkey;
          ALTER TABLE temoignages_campagnes DROP CONSTRAINT IF EXISTS temoignages_campagnes_temoignage_id_fkey;
          ALTER TABLE temoignages_campagnes DROP CONSTRAINT IF EXISTS temoignages_campagnes_campagne_id_fkey;
          ALTER TABLE verbatims DROP CONSTRAINT IF EXISTS verbatims_temoignage_id_fkey;
          ALTER TABLE users_etablissements DROP CONSTRAINT IF EXISTS users_etablissements_user_id_fkey;
          ALTER TABLE users_etablissements DROP CONSTRAINT IF EXISTS users_etablissements_etablissement_id_fkey;
  
          DROP TABLE IF EXISTS verbatims;
          DROP TABLE IF EXISTS temoignages_campagnes;
          DROP TABLE IF EXISTS formations;
          DROP TABLE IF EXISTS temoignages;
          DROP TABLE IF EXISTS users_etablissements;
          DROP TABLE IF EXISTS campagnes;
          DROP TABLE IF EXISTS questionnaires;
          DROP TABLE IF EXISTS users;
          DROP TABLE IF EXISTS etablissements;
        `.compile(db)
  );
};
