import type { JsonValue } from "../../db/schema";
import type { Campagne, Etablissement, Formation, ObserverScope } from "../../types";

export type GetAllWithTemoignageCountAndTemplateNameArgs = {
  query: { diplome?: string[]; siret?: string[]; departement?: string; campagneIds?: string[] };
  scope?: ObserverScope | null;
  allowEmptyFilter?: boolean;
};

export type GetAllWithTemoignageCountAndTemplateNameResults = Promise<
  Array<
    Pick<Campagne, "id" | "nomCampagne" | "startDate" | "endDate" | "seats" | "createdAt" | "updatedAt"> & {
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
    }
  >
>;

export type GetOneWithTemoignagneCountAndTemplateNameResults = Promise<
  | (Pick<Campagne, "id" | "nomCampagne" | "startDate" | "endDate" | "seats" | "createdAt" | "updatedAt"> & {
      questionnaire: {
        questionnaireId: string;
        questionnaireTemplateName: string;
        questionnaire: JsonValue;
        questionnaireUI: JsonValue;
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
      etablissement: Omit<Etablissement, "catalogueData" | "deletedAt" | "createdAt" | "updatedAt"> & {
        numeroVoie: string;
        typeVoie: string;
        nomVoie: string;
        codePostal: string;
      };
      temoignagesCount: number;
    })
  | null
>;

export type GetAllWithTemoignageCountFormationEtablissementResults = Promise<
  Array<
    Pick<Campagne, "id" | "nomCampagne" | "startDate" | "endDate" | "seats" | "createdAt" | "updatedAt"> & {
      formation: Omit<
        Formation,
        "catalogueData" | "onisepSlug" | "etablissementId" | "deletedAt" | "createdAt" | "updatedAt"
      > & {
        rncpCode: string;
        idCertifinfo: string;
        bcnMefs10: string;
      };
      etablissement: Omit<Etablissement, "catalogueData" | "deletedAt" | "createdAt" | "updatedAt"> & {
        numeroVoie: string;
        typeVoie: string;
        nomVoie: string;
        codePostal: string;
      };
      temoignagesCount: number;
    }
  >
>;
