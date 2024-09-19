const formationsDao = require("../dao/formations.dao");

const createFormation = async (formation) => {
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

const getFormations = async ({ formationIds, search }) => {
  try {
    const query = search ? { searchText: search } : {};

    if (formationIds.length) {
      query.formationIds = formationIds;
    }

    const formations = await formationsDao.findAll(query);

    return { success: true, body: formations };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getFormationsWithTemoignageCount = async () => {
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

const getFormation = async (id) => {
  try {
    const formation = await formationsDao.findOne(id);
    return { success: true, body: formation };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteFormation = async (id) => {
  try {
    const formation = await formationsDao.deleteOne(id);
    return { success: true, body: formation };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateFormation = async (id, updatedFormation) => {
  try {
    const formation = await formationsDao.update(id, updatedFormation);

    if (!formation) throw new Error("Formation not found");

    return { success: true, body: formation };
  } catch (error) {
    return { success: false, body: error };
  }
};

const alreadyExistingFormations = async (ids) => {
  try {
    const existingFormations = await formationsDao.findDataIdFormationByIds(ids);
    return { success: true, body: existingFormations.map((formation) => formation.catalogueId) };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  createFormation,
  getFormations,
  getFormation,
  deleteFormation,
  updateFormation,
  alreadyExistingFormations,
  getFormationsWithTemoignageCount,
};
