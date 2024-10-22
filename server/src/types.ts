import { Etablissements, Formations, Questionnaires, Temoignages, Users, Verbatims } from "./db/schema";

export type User = Omit<Users, "id" | "accepted_cgu" | "email_confirmed"> & {
  id: string;
  accepted_cgu: boolean | null;
  email_confirmed: boolean | null;
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

export type Verbatim = Omit<Verbatims, "id" | "created_at" | "deleted_at" | "updated_at"> & {
  id: string;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
};

export type ObserverScope = { field: "region" | "num_departement" | "sirets"; value: string };
