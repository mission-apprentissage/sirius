import { Formation } from "../../types";

export type GetAllWithFormationAndQuestionnaire =
  | {
      id: string;
      reponses: Record<string, any>;
      nom_campagne: string | null;
      questionnaire_id: string;
      formation: Pick<
        Formation,
        | "intitule_long"
        | "localite"
        | "etablissement_formateur_enseigne"
        | "etablissement_formateur_entreprise_raison_sociale"
        | "etablissement_formateur_siret"
      >;
    }
  | undefined;
