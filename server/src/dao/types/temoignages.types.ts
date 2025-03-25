import type { OffsetPaginationResult } from "kysely-paginate";

import type { Campagne, Formation, Temoignage, Verbatim } from "../../types";

export type FindAllResults = Promise<
  (Temoignage & {
    etablissementFormateurEntrepriseRaisonSociale: string | null;
    etablissementFormateurEnseigne: string | null;
    etablissementGestionnaireEnseigne: string | null;
  })[]
>;

export type FindAllWithVerbatimsResults = Promise<
  (Temoignage & {
    verbatims: Pick<
      Verbatim,
      "id" | "temoignageId" | "questionKey" | "content" | "status" | "scores" | "themes" | "deletedAt"
    >[];
  } & { campagneId: string })[]
>;

export type GetAllTemoignagesWithFormationResults = Promise<
  OffsetPaginationResult<
    Temoignage & {
      formation: Pick<
        Formation,
        | "id"
        | "intituleLong"
        | "diplome"
        | "localite"
        | "tags"
        | "lieuFormationAdresseComputed"
        | "duree"
        | "etablissementFormateurEnseigne"
        | "etablissementFormateurEntrepriseRaisonSociale"
        | "etablissementGestionnaireEnseigne"
        | "etablissementGestionnaireSiret"
      >;
    }
  >
>;

export type GetAllWithFormationAndQuestionnaireResults = (Pick<Temoignage, "id" | "reponses"> &
  Pick<Campagne, "nomCampagne" | "questionnaireId"> & {
    formation: Pick<
      Formation,
      | "intituleLong"
      | "localite"
      | "etablissementFormateurEnseigne"
      | "etablissementFormateurEntrepriseRaisonSociale"
      | "etablissementFormateurSiret"
    >;
  })[];
