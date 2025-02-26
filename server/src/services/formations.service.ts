import fs from "fs";

import { OBSERVER_SCOPES } from "../constants";
import * as formationsDao from "../dao/formations.dao";
import type { FindAllArgs } from "../dao/types/formations.types";
import type { ObserverScope, Opco } from "../types";
import { getStaticFilePath } from "../utils/getStaticFilePath";

export const getFormations = async ({
  etablissementSiret,
  search,
}: {
  etablissementSiret?: string;
  search?: string;
}) => {
  try {
    const query = {} as FindAllArgs;

    if (search) {
      query.searchText = search;
    }

    if (etablissementSiret) {
      query.etablissementSiret = etablissementSiret;
    }

    const formations = await formationsDao.findAll(query);

    return { success: true, body: formations };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getFormationsWithTemoignageCount = async () => {
  try {
    const formations = await formationsDao.findAllWithTemoignageCount();

    if (!formations?.length) {
      return { success: false, body: "No formations found" };
    }

    const reformatForExtension = formations.map((formation) => ({
      ...formation,
      onisep_intitule: formation.onisepIntitule,
    }));

    return { success: true, body: reformatForExtension };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getFormationsEtablissementsDiplomesWithCampagnesCount = async ({
  userSiret,
  scope,
}: {
  userSiret?: string[];
  scope: ObserverScope | undefined;
}) => {
  try {
    // Nécessaire pour ne pas stocker la liste de code RNCP dans le scope d'un user et réconcilier les labels/valeurs
    if (scope?.field === OBSERVER_SCOPES.OPCO) {
      const SCOPE_LIST = getStaticFilePath("./opco.json");
      const opcos = JSON.parse(fs.readFileSync(SCOPE_LIST, "utf8"));
      const rncpCodes = opcos.find((opco: Opco) => opco.label === scope.value).value;

      scope.value = rncpCodes;
    }

    const formations = await formationsDao.findAllWithCampagnesCount(userSiret, scope);

    if (!formations?.length) {
      return { success: false, body: "No formations found" };
    }

    const formattedByDiplome = formations.reduce<Record<string, number>>((acc, formation) => {
      const diplome = formation.diplome || "N/A";

      if (!acc[diplome]) {
        acc[diplome] = 0;
      }

      acc[diplome] += formation.campagnesCount;

      return acc;
    }, {});

    const formattedByEtablissement = formations.reduce<
      Record<
        string,
        {
          campagnesCount: number;
          etablissementFormateurEnseigne: string | null;
          etablissementFormateurEntrepriseRaisonSociale: string | null;
          etablissementFormateurSiret: string;
        }
      >
    >((acc, formation) => {
      const etablissementFormateurSiret = formation.etablissementFormateurSiret || "N/A";

      if (!acc[etablissementFormateurSiret]) {
        acc[etablissementFormateurSiret] = {
          campagnesCount: 0,
          etablissementFormateurEnseigne: formation.etablissementFormateurEnseigne,
          etablissementFormateurEntrepriseRaisonSociale: formation.etablissementFormateurEntrepriseRaisonSociale,
          etablissementFormateurSiret: formation.etablissementFormateurSiret,
        };
      }

      acc[etablissementFormateurSiret].campagnesCount += formation.campagnesCount;

      return acc;
    }, {});

    const diplomes = Object.keys(formattedByDiplome)
      .map((diplome) => ({
        intitule: diplome,
        campagnesCount: formattedByDiplome[diplome],
      }))
      .sort((a, b) => b.campagnesCount - a.campagnesCount);

    const etablissements = Object.keys(formattedByEtablissement)
      .map((etablissement) => ({
        etablissementFormateurSiret: etablissement,
        etablissementFormateurEnseigne: formattedByEtablissement[etablissement].etablissementFormateurEnseigne,
        etablissementFormateurEntrepriseRaisonSociale:
          formattedByEtablissement[etablissement].etablissementFormateurEntrepriseRaisonSociale,
        campagnesCount: formattedByEtablissement[etablissement].campagnesCount,
      }))
      .sort((a, b) => b.campagnesCount - a.campagnesCount);

    return { success: true, body: { diplomes, etablissements } };
  } catch (error) {
    return { success: false, body: error };
  }
};
