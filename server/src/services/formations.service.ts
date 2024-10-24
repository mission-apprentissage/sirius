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
    console.log({ error });
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

export const alreadyExistingFormations = async (ids) => {
  try {
    const existingFormations = await formationsDao.findDataIdFormationByIds(ids);
    return { success: true, body: existingFormations.map((formation) => formation.catalogueId) };
  } catch (error) {
    return { success: false, body: error };
  }
};
