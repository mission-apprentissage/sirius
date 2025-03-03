import type { Request } from "express";

import type { USER_ROLES, USER_STATUS, VERBATIM_STATUS, VERBATIM_THEMES } from "./constants";
import type { JsonValue } from "./db/schema";
export type Campagne = {
  id: string;
  nomCampagne: string | null;
  startDate: Date;
  endDate: Date;
  questionnaireId: string | null;
  seats: number | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CampagneCreation = {
  nomCampagne: string;
  startDate: Date;
  endDate: Date;
  questionnaireId: string | null;
  seats: number | null;
};

export type CampagneUpdate = {
  nomCampagne: string;
  startDate: Date;
  endDate: Date;
  questionnaireId: string | null;
  seats: number | null;
};

export type CampagneWithStatistics = Pick<
  Campagne,
  "id" | "nomCampagne" | "startDate" | "endDate" | "seats" | "createdAt" | "updatedAt"
> & {
  questionnaire: {
    questionnaireId: string;
    questionnaireTemplateName: string;
  };
} & {
  formation: Omit<
    Formation,
    | "catalogueData"
    | "cfd"
    | "onisepSlug"
    | "intituleCourt"
    | "etablissementId"
    | "etablissementFormateurLocalite"
    | "etablissementFormateurAdresse"
    | "deletedAt"
    | "createdAt"
    | "updatedAt"
  >;
  etablissement: Omit<Etablissement, "catalogueData" | "onisepUrl" | "deletedAt" | "createdAt" | "updatedAt"> & {
    numeroVoie: string;
    typeVoie: string;
    nomVoie: string;
    codePostal: string;
  };
  temoignagesCount: number;
  temoignages?: Array<{ id: string; lastQuestionAt: string; createdAt: string }>;
  possibleChampsLibreCount: number;
  medianDurationInMs: string;
};

export type Etablissement = {
  id: string;
  catalogueId: string;
  siret: string;
  onisepNom: string | null;
  onisepUrl: string | null;
  enseigne: string | null;
  entrepriseRaisonSociale: string | null;
  uai: string | null;
  localite: string | null;
  regionImplantationNom: string | null;
  catalogueData: Record<string, unknown>;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type EtablissementCreation = {
  catalogueId: string;
  siret: string;
  onisepNom: string;
  onisepUrl: string;
  enseigne: string;
  entrepriseRaisonSociale: string;
  uai: string;
  localite: string;
  regionImplantationNom: string;
  catalogueData: JsonValue;
};

export type Questionnaire = {
  id: string;
  nom: string;
  questionnaire: any;
  questionnaireUi: any;
  isValidated: boolean;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type QuestionnaireCreation = {
  id: string;
  nom: string;
  questionnaire: any;
  questionnaireUi: any;
  isValidated: boolean;
};

export type QuestionnaireUpdate = {
  nom: string;
  questionnaire: any;
  questionnaireUi: any;
  isValidated: boolean;
};

export type FormationCreation = {
  catalogueId: string;
  catalogueData: JsonValue;
  cfd: string[] | null;
  codePostal: string;
  diplome: string;
  duree: number;
  etablissementFormateurAdresse: string | null;
  etablissementFormateurEnseigne: string | null;
  etablissementFormateurEntrepriseRaisonSociale: string | null;
  etablissementFormateurLocalite: string | null;
  etablissementFormateurSiret: string;
  etablissementGestionnaireEnseigne: string | null;
  etablissementGestionnaireSiret: string;
  etablissementId: string | undefined;
  intituleCourt: string | null;
  intituleLong: string | null;
  lieuFormationAdresse: string | null;
  lieuFormationAdresseComputed: string | null;
  localite: string;
  numDepartement: string;
  onisepSlug: string | null;
  region: string;
  tags: string;
};

export type Formation = {
  id: string;
  catalogueId: string;
  catalogueData: Record<string, unknown>;
  cfd: string[] | null;
  codePostal: string;
  diplome: string;
  duree: number;
  etablissementFormateurAdresse: string | null;
  etablissementFormateurEnseigne: string | null;
  etablissementFormateurEntrepriseRaisonSociale: string | null;
  etablissementFormateurLocalite: string | null;
  etablissementFormateurSiret: string;
  etablissementGestionnaireEnseigne: string | null;
  etablissementGestionnaireSiret: string;
  etablissementId: string | null;
  intituleCourt: string | null;
  intituleLong: string | null;
  lieuFormationAdresse: string | null;
  lieuFormationAdresseComputed: string | null;
  localite: string;
  numDepartement: string;
  onisepSlug: string | null;
  region: string;
  tags: string[];
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Job = {
  id: string;
  type: string;
  status: string;
  progress: number | null;
  total: number | null;
  error: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type JobCreation = {
  id: string;
  type: string;
  status: string;
  progress: number;
  total: number;
};

export type JobUpdate = { progress?: number; total?: number; status?: string; error?: string };

export type Temoignage = {
  id: string;
  reponses: JsonValue | null;
  isBot: boolean | null;
  lastQuestionAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type TemoignageCreation = {
  reponses: JsonValue | null;
  isBot: boolean | null;
  lastQuestionAt: Date | null;
  campagneId: string;
};

export type TemoignageUpdate = {
  reponses: JsonValue | null;
  isBot: boolean | null;
  lastQuestionAt: Date | null;
};

export type VerbatimScore = {
  GEM: {
    avis: YesNoType;
    justification: string;
  };
  ALERT: number;
  TO_FIX: number;
  REJECTED: number;
  VALIDATED: number;
  NOT_VALIDATED: number;
};

export type VerbatimThemes = {
  [key in keyof typeof VERBATIM_THEMES]: boolean;
};

export type VerbatimStatus = (typeof VERBATIM_STATUS)[keyof typeof VERBATIM_STATUS];

export type Verbatim = {
  id: string;
  temoignageId: string;
  questionKey: string;
  content: string | null;
  contentCorrected: string | null;
  correctionJustification: string | null;
  anonymizationJustification: string | null;
  contentCorrectedAnonymized: string | null;
  status: string;
  scores: VerbatimScore | null;
  themes: VerbatimThemes | null;
  feedbackCount: number | null;
  isAnonymized: boolean;
  isCorrected: boolean;
  createdAt: Date | null;
  deletedAt: Date | null;
  updatedAt: Date | null;
};

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean | null;
  role: UserRole;
  scope: ObserverScope | null;
  status: UserStatus;
  comment: string | null;
  salt: string;
  hash: string;
  acceptedCgu: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  refreshToken: JsonValue | null;
  notificationsEmail: JsonValue | null;
  confirmationToken: string | null;
};

export type UserWithEtablissementsSiret = User & {
  etablissements: {
    siret: string[];
  }[];
};

export type UserCreation = {
  email: string;
  role: UserRole;
  comment: string;
  confirmationToken: string;
  firstName: string;
  lastName: string;
  salt: string;
  hash: string;
};

export type ObserverScope = { field: "region" | "num_departement" | "sirets"; value: string };

export interface FetchOptions {
  method: string;
  headers: Record<string, string>;
  body: string;
}

type YesNoType = "oui" | "non";

export interface ExpositionApiResponse {
  text: string;
  exposition: Record<string, YesNoType>;
  correction: {
    correction: string;
    modification: YesNoType;
    justification: string;
  };
  anonymisation: {
    anonymisation: string;
    modification: YesNoType;
    justification: string;
  };
}

export type AuthedRequest = Request & {
  user: User & {
    etablissements:
      | Pick<
          Etablissement,
          | "id"
          | "catalogueId"
          | "siret"
          | "onisepNom"
          | "onisepUrl"
          | "enseigne"
          | "entrepriseRaisonSociale"
          | "uai"
          | "localite"
          | "regionImplantationNom"
        >[]
      | null;
  };
};

export type Opco = {
  label: string;
  value: string[];
};
