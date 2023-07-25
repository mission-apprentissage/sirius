const formationsDao = require("../dao/formations.dao");

const createFormation = async (formation) => {
  try {
    const existingFormationQuery = {
      "data._id": formation.data._id,
    };
    const existingFormation = await formationsDao.getAll(existingFormationQuery);

    if (existingFormation.length) {
      throw new Error("Formation déjà existante");
    }

    const createdFormation = await formationsDao.create(formation);

    return { success: true, body: createdFormation };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getFormations = async (query) => {
  try {
    const formations = await formationsDao.getAll(query);
    return { success: true, body: formations };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getFormation = async (id) => {
  try {
    const formation = await formationsDao.getOne(id);
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

module.exports = { createFormation, getFormations, getFormation, deleteFormation, updateFormation };
