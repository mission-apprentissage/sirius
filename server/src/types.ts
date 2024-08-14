import { Etablissements, Formations, Questionnaires, Users } from "./db/schema";

export type User = Omit<Users, "id"> & { id: string };

export type UserCreation = User & { confirmationToken: string };

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
