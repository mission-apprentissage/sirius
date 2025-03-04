import type { Formation } from "../../types";

export type FindAllArgs = {
  formationIds?: string[];
  campagneId?: string;
  searchText?: string;
  etablissementSiret?: string;
  catalogueId?: string;
};

export type FindAllResults =
  | Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt">[]
  | undefined;

export type FindFormationByIntituleCfdIdCertifInfoOrSlugResults =
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagneId: string | null;
    })[]
  | undefined;

export type FindFormationByUaiResults =
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagneId: string | null;
    })[]
  | undefined;

export type FindAllWithTemoignageCountResults =
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      temoignagesCount: number;
      onisepIntitule: string;
    })[]
  | undefined;

export type FindAllWithCampagnesCountResults =
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagnesCount: number;
    })[]
  | undefined;
