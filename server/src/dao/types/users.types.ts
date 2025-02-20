import type { Etablissement, User } from "../../types";

export type FindAllResults = Promise<Omit<User, "salt" | "hash" | "refreshToken">[] | undefined>;

export type FindOneByEmailWithEtablissementResults = Promise<
  | (Omit<User, "refreshToken" | "notificationsEmail"> & {
      etablissements?: Pick<
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
      >[];
    })
  | undefined
>;

export type FindOneByIdWithEtablissementResults = Promise<
  | (User & {
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
    })
  | undefined
>;

export type FindAllWithEtablissementResults = Promise<
  | (Omit<User, "refreshToken" | "notificationsEmail" | "hash" | "salt"> & {
      etablissements?: Pick<
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
      >[];
    })[]
  | undefined
>;
