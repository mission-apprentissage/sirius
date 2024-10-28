// @ts-nocheck -- TODO

import * as formationsDao from "../dao/formations.dao";

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

export const getFormationsDiplomesWithCampagnes = async ({ userSiret }) => {
  try {
    const formations = await formationsDao.findAllWithCampagnesCount(userSiret);

    const formattedByDiplome = formations.reduce((acc, formation) => {
      const diplome = formation.diplome || "N/A";

      if (!acc[diplome]) {
        acc[diplome] = 0;
      }

      acc[diplome] += formation.campagnesCount;

      return acc;
    }, {});

    const result = Object.keys(formattedByDiplome)
      .map((diplome) => ({
        intitule: diplome,
        campagnesCount: formattedByDiplome[diplome],
      }))
      .sort((a, b) => b.campagnesCount - a.campagnesCount);

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};
