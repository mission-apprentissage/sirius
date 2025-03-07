import type { ETABLISSEMENT_RELATION_TYPE } from "./constants";

export interface ReferentielOrganisme {
  pagination: Pagination;
  organismes: Organisme[];
}

export interface Pagination {
  page: number;
  resultats_par_page: number;
  nombre_de_page: number;
  total: number;
}

export interface Organisme {
  siret: string;
  _meta: Meta;
  certifications: Certification[];
  contacts: Contact[];
  diplomes: Diplome[];
  lieux_de_formation: LieuDeFormation[];
  referentiels: string[];
  relations: Relation[];
  reseaux: Reseau[];
  uai_potentiels: UaiPotentiel[];
  etat_administratif: string;
  forme_juridique: FormeJuridique;
  raison_sociale: string;
  siege_social: boolean;
  adresse: Adresse;
  nature: string;
  numero_declaration_activite: string;
  qualiopi: boolean;
  uai: string;
}

export interface Relation {
  type: (typeof ETABLISSEMENT_RELATION_TYPE)[keyof typeof ETABLISSEMENT_RELATION_TYPE];
  siret: string;
  label: string;
  referentiel: boolean;
  sources: string[];
  date_collecte: string;
}

export interface Meta {
  anomalies: Anomaly[];
  date_import: string;
  date_dernier_import: string;
  date_collecte: string;
  uai_probable: string;
  nouveau: boolean;
}

export interface Anomaly {
  key: string;
  type: string;
  details: string;
  job: string;
  sources: string[];
  date_collecte: string;
}

export interface Certification {
  type: string;
  code: string;
  label: string;
  sources: string[];
  date_collecte: string;
}

export interface Contact {
  email: string;
  confirmé: boolean;
  sources: string[];
  date_collecte: string;
}

export interface Diplome {
  type: string;
  code: string;
  niveau: string;
  label: string;
  sources: string[];
  date_collecte: string;
}

export interface LieuDeFormation {
  code: string;
  adresse: LieuAdresse;
  uai: string;
  uai_fiable: boolean;
  sources: string[];
  date_collecte: string;
}

export interface LieuAdresse {
  label: string;
  code_postal: string;
  code_insee: string;
  localite: string;
  geojson: Geojson;
  departement: Departement;
  region: Region;
  academie: Academie;
}

export interface Geojson {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: {
    score: number;
    source: string;
  };
}

export interface Departement {
  code: string;
  nom: string;
}

export interface Region {
  code: string;
  nom: string;
}

export interface Academie {
  code: string;
  nom: string;
}

export interface Reseau {
  code: string;
  label: string;
  sources: string[];
  date_collecte: string;
}

export interface UaiPotentiel {
  uai: string;
  sources: string[];
  date_collecte: string;
}

export interface FormeJuridique {
  code: string;
  label: string;
}

export interface Adresse {
  academie: Academie;
  code_insee: string;
  code_postal: string;
  departement: Departement;
  geojson: Geojson;
  label: string;
  localite: string;
  region: Region;
}
