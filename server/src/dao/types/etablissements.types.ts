import type { Etablissement } from "../../types";

export type FindAllEtablissementWithCountsResults = Promise<
  (Pick<
    Etablissement,
    "id" | "siret" | "onisepNom" | "enseigne" | "entrepriseRaisonSociale" | "regionImplantationNom" | "createdAt"
  > & {
    campagnesCount: number;
    temoignagesCount: number;
    verbatimsCount: number;
  })[]
>;

export type FindAllWithTemoignageCountResults = Promise<
  (Pick<
    Etablissement,
    | "id"
    | "siret"
    | "onisepNom"
    | "onisepUrl"
    | "enseigne"
    | "entrepriseRaisonSociale"
    | "uai"
    | "localite"
    | "createdAt"
  > & {
    temoignagesCount: number;
  })[]
>;
