import type { OffsetPaginationResult } from "kysely-paginate";

import type { VERBATIM_STATUS } from "../../constants";
import type { Campagne, Formation, Verbatim, VerbatimStatus } from "../../types";

export type GetAllArgs = {
  temoignageIds: string[];
  status: VerbatimStatus[];
  questionKey?: string[];
};

export type GetAllResults = Promise<
  Pick<
    Verbatim,
    | "id"
    | "temoignageId"
    | "status"
    | "questionKey"
    | "content"
    | "scores"
    | "themes"
    | "feedbackCount"
    | "deletedAt"
    | "createdAt"
    | "updatedAt"
  >[]
>;

export type CountArgs = {
  temoignageIds?: string[];
  questionKey?: string[];
  etablissementSiret?: string;
  formationId?: string;
  status?: VerbatimStatus;
};

export type GetAllWithFormationResults = Promise<
  OffsetPaginationResult<
    Omit<Verbatim, "temoignageId" | "themes" | "feedbackCount" | "deletedAt" | "updatedAt"> & {
      formation: Pick<
        Formation,
        | "intituleLong"
        | "etablissementFormateurEnseigne"
        | "etablissementFormateurEntrepriseRaisonSociale"
        | "etablissementFormateurSiret"
      >;
    } & {
      maxScoreKey?: Record<string, unknown>;
      highestScoreKey?: (typeof VERBATIM_STATUS)[keyof typeof VERBATIM_STATUS];
    }
  >
>;

export type GetAllWithFormationAndCampagneResult = Promise<
  (Pick<Verbatim, "id" | "questionKey" | "content" | "status"> &
    Pick<Campagne, "nomCampagne" | "questionnaireId"> & {
      formation: Pick<
        Formation,
        | "intituleLong"
        | "etablissementFormateurEnseigne"
        | "etablissementFormateurEntrepriseRaisonSociale"
        | "etablissementFormateurSiret"
      >;
    })[]
>;
