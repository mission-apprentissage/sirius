import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Campagnes {
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  end_date: Timestamp;
  id: Generated<string>;
  nom_campagne: string;
  questionnaire_id: string | null;
  seats: number | null;
  start_date: Timestamp;
  updated_at: Generated<Timestamp | null>;
}

export interface Etablissements {
  catalogue_data: Json | null;
  catalogue_id: string | null;
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  enseigne: string | null;
  entreprise_raison_sociale: string | null;
  id: Generated<string>;
  localite: string | null;
  onisep_nom: string | null;
  onisep_url: string | null;
  region_implantation_nom: string | null;
  siret: string | null;
  uai: string | null;
  updated_at: Generated<Timestamp | null>;
}

export interface Formations {
  campagne_id: string | null;
  catalogue_data: Json | null;
  catalogue_id: string | null;
  code_postal: string | null;
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  diplome: string | null;
  duree: number | null;
  etablissement_formateur_adresse: string | null;
  etablissement_formateur_enseigne: string | null;
  etablissement_formateur_entreprise_raison_sociale: string | null;
  etablissement_formateur_localite: string | null;
  etablissement_formateur_siret: string | null;
  etablissement_gestionnaire_enseigne: string | null;
  etablissement_gestionnaire_siret: string | null;
  etablissement_id: string | null;
  id: Generated<string>;
  intitule_court: string | null;
  intitule_long: string | null;
  lieu_formation_adresse: string | null;
  lieu_formation_adresse_computed: string | null;
  localite: string | null;
  num_departement: string | null;
  region: string | null;
  tags: Json | null;
  updated_at: Generated<Timestamp | null>;
}

export interface Questionnaires {
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  id: Generated<string>;
  is_validated: Generated<boolean | null>;
  nom: string;
  questionnaire: Json | null;
  questionnaire_ui: Json | null;
  updated_at: Generated<Timestamp | null>;
}

export interface Temoignages {
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  id: Generated<string>;
  is_bot: Generated<boolean | null>;
  last_question_at: Timestamp | null;
  reponses: Json | null;
  updated_at: Generated<Timestamp | null>;
}

export interface TemoignagesCampagnes {
  campagne_id: string | null;
  id: Generated<string>;
  temoignage_id: string | null;
}

export interface Users {
  accepted_cgu: Generated<boolean | null>;
  comment: string | null;
  confirmation_token: string | null;
  email: string;
  email_confirmed: Generated<boolean | null>;
  firstname: string;
  hash: string | null;
  id: Generated<string>;
  lastname: string;
  refresh_token: Json | null;
  role: string;
  salt: string | null;
  scope: Json | null;
  status: string | null;
}

export interface UsersEtablissements {
  etablissement_id: string | null;
  id: Generated<string>;
  user_id: string | null;
}

export interface Verbatims {
  content: string | null;
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  id: Generated<string>;
  question_key: string | null;
  scores: Json | null;
  status: string | null;
  temoignage_id: string | null;
  themes: Json | null;
  updated_at: Generated<Timestamp | null>;
}

export interface DB {
  campagnes: Campagnes;
  etablissements: Etablissements;
  formations: Formations;
  questionnaires: Questionnaires;
  temoignages: Temoignages;
  temoignages_campagnes: TemoignagesCampagnes;
  users: Users;
  users_etablissements: UsersEtablissements;
  verbatims: Verbatims;
}
