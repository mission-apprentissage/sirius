import type { Formation } from "../../types";

export type FindAllArgs = {
  formationIds?: string[];
  campagneId?: string;
  searchText?: string;
  etablissementSiret?: string;
  catalogueId?: string;
};

export type FindAllResults = Promise<
  Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt">[] | undefined
>;

export type FindOneResults = Promise<
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagneId: string | null;
    })
  | null
>;

export type FindOneByCatalogueIdResults = Promise<
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagneId: string | null;
    })
  | null
>;

export type FindFormationByIntituleCfdIdCertifInfoOrSlugResults = Promise<
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagneId: string | null;
    })[]
  | undefined
>;

export type FindFormationByUaiResults = Promise<
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagneId: string | null;
    })[]
  | undefined
>;

export type FindAllWithTemoignageCountResults = Promise<
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      temoignagesCount: number;
      onisepIntitule: string;
    })[]
  | undefined
>;

export type FindAllWithCampagnesCountResults = Promise<
  | (Omit<Formation, "catalogueData" | "cfd" | "onisepSlug" | "createdAt" | "updatedAt" | "deletedAt"> & {
      campagnesCount: number;
    })[]
  | undefined
>;
