import type { Etablissements, Formations, Questionnaires, Temoignages, Users, Verbatims } from "./db/schema";

export type User = Omit<Users, "id" | "accepted_cgu" | "email_confirmed" | "created_at" | "updated_at"> & {
  id: string;
  accepted_cgu: boolean | null;
  email_confirmed: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
};

export type UserWithEtablissementsSiret = User & {
  etablissements: {
    siret: string[];
  }[];
};

export type UserCreation = Omit<User, "first_name" | "last_name"> & {
  confirmationToken: string;
  firstName: string;
  lastName: string;
};

export type UserPublic = Omit<User, "salt" | "hash" | "refresh_token">;

export type Etablissement = Omit<Etablissements, "id" | "created_at" | "deleted_at" | "updated_at"> & {
  id: string;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
};

export type Formation = Omit<Formations, "id" | "created_at" | "deleted_at" | "updated_at"> & {
  id: string;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
};

export type Questionnaire = Omit<Questionnaires, "id" | "is_validated" | "created_at" | "deleted_at" | "updated_at"> & {
  id: string;
  is_validated: boolean;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
};

export type Temoignage = Omit<
  Temoignages,
  "id" | "is_bot" | "last_question_at" | "created_at" | "deleted_at" | "updated_at"
> & {
  id: string;
  is_bot: boolean | undefined;
  last_question_at: Date | null;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
};

export type Verbatim = Omit<
  Verbatims,
  "id" | "feedback_count" | "is_anonymized" | "is_corrected" | "created_at" | "deleted_at" | "updated_at"
> & {
  id: string;
  feedback_count: number | null;
  is_anonymized: boolean;
  is_corrected: boolean;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
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
