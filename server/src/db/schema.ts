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
  catalogue_data: Json;
  catalogue_id: string;
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  enseigne: string | null;
  entreprise_raison_sociale: string | null;
  id: Generated<string>;
  localite: string | null;
  onisep_nom: string | null;
  onisep_url: string | null;
  region_implantation_nom: string | null;
  siret: string;
  uai: string | null;
  updated_at: Generated<Timestamp | null>;
}

export interface Formations {
  catalogue_data: Json;
  catalogue_id: string;
  code_postal: string;
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  diplome: string;
  duree: number;
  etablissement_formateur_adresse: string | null;
  etablissement_formateur_enseigne: string | null;
  etablissement_formateur_entreprise_raison_sociale: string | null;
  etablissement_formateur_localite: string | null;
  etablissement_formateur_siret: string;
  etablissement_gestionnaire_enseigne: string | null;
  etablissement_gestionnaire_siret: string;
  etablissement_id: string | null;
  id: Generated<string>;
  intitule_court: string | null;
  intitule_long: string | null;
  lieu_formation_adresse: string | null;
  lieu_formation_adresse_computed: string | null;
  localite: string;
  num_departement: string;
  onisep_slug: string | null;
  region: string;
  tags: Json | null;
  updated_at: Generated<Timestamp | null>;
}

export interface FormationsCampagnes {
  campagne_id: string | null;
  formation_id: string | null;
  id: Generated<string>;
}

export interface Jobs {
  created_at: Generated<Timestamp | null>;
  error: string | null;
  id: Generated<string>;
  progress: Generated<number | null>;
  status: string;
  total: Generated<number | null>;
  type: string;
  updated_at: Generated<Timestamp | null>;
}

export interface Questionnaires {
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  id: Generated<string>;
  is_validated: Generated<boolean>;
  nom: string;
  questionnaire: Json;
  questionnaire_ui: Json;
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
  accepted_cgu: boolean | null;
  comment: string | null;
  confirmation_token: string | null;
  created_at: Generated<Timestamp | null>;
  email: string;
  email_confirmed: boolean | null;
  first_name: string;
  hash: string;
  id: Generated<string>;
  last_name: string;
  notifications_email: Json | null;
  refresh_token: Json | null;
  role: string;
  salt: string;
  scope: Json | null;
  status: string;
  updated_at: Generated<Timestamp | null>;
}

export interface UsersEtablissements {
  etablissement_id: string;
  id: Generated<string>;
  user_id: string;
}

export interface Verbatims {
  anonymization_justification: string | null;
  content: string | null;
  content_corrected: string | null;
  content_corrected_anonymized: string | null;
  correction_justification: string | null;
  created_at: Generated<Timestamp | null>;
  deleted_at: Timestamp | null;
  feedback_count: Generated<number | null>;
  id: Generated<string>;
  is_anonymized: Generated<boolean>;
  is_corrected: Generated<boolean>;
  question_key: string;
  scores: Json | null;
  status: string;
  temoignage_id: string;
  themes: Json | null;
  updated_at: Generated<Timestamp | null>;
}

export interface DB {
  campagnes: Campagnes;
  etablissements: Etablissements;
  formations: Formations;
  formations_campagnes: FormationsCampagnes;
  jobs: Jobs;
  questionnaires: Questionnaires;
  temoignages: Temoignages;
  temoignages_campagnes: TemoignagesCampagnes;
  users: Users;
  users_etablissements: UsersEtablissements;
  verbatims: Verbatims;
}
