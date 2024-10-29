// @ts-nocheck -- TODO

import fs from "fs";

import { OBSERVER_SCOPES } from "../constants";
import * as formationsDao from "../dao/formations.dao";
import { getStaticFilePath } from "../utils/getStaticFilePath";

export const createFormation = async (formation) => {
  try {
    const existingFormation = await formationsDao.findOneByCatalogueId(formation.data._id);
    if (existingFormation.length) {
      throw new Error("Formation déjà existante");
    }

    const createdFormation = await formationsDao.create(formation);

    return { success: true, body: createdFormation };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getFormations = async ({ formationIds, etablissementSiret, search }) => {
  try {
    const query = search ? { searchText: search } : {};

    if (formationIds?.length) {
      query.formationIds = formationIds;
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

    const reformatForExtension = formations.map((formation) => ({
      ...formation,
      onisep_intitule: formation.onisepIntitule,
    }));

    return { success: true, body: reformatForExtension };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getFormation = async (id) => {
  try {
    const formation = await formationsDao.findOne(id);
    return { success: true, body: formation };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteFormation = async (id) => {
  try {
    const formation = await formationsDao.deleteOne(id);
    return { success: true, body: formation };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateFormation = async (id, updatedFormation) => {
  try {
    const formation = await formationsDao.update(id, updatedFormation);

    if (!formation) throw new Error("Formation not found");

    return { success: true, body: formation };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getFormationsEtablissementsDiplomesWithCampagnesCount = async ({ userSiret, scope }) => {
  try {
    // Nécessaire pour ne pas stocker la liste de code RNCP dans le scope d'un user et réconcilier les labels/valeurs
    if (scope.field === OBSERVER_SCOPES.OPCO) {
      const SCOPE_LIST = getStaticFilePath("./opco.json");
      const opcos = JSON.parse(fs.readFileSync(SCOPE_LIST, "utf8"));
      const rncpCodes = opcos.find((opco) => opco.label === scope.value).value;

      scope.value = rncpCodes;
    }

    const formations = await formationsDao.findAllWithCampagnesCount(userSiret, scope);

    const formattedByDiplome = formations.reduce((acc, formation) => {
      const diplome = formation.diplome || "N/A";

      if (!acc[diplome]) {
        acc[diplome] = 0;
      }

      acc[diplome] += formation.campagnesCount;

      return acc;
    }, {});

    const formattedByEtablissement = formations.reduce((acc, formation) => {
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
