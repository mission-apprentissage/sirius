const etablissementsDao = require("../dao/etablissements.dao");

const createEtablissement = async (etablissement) => {
  try {
    const createdetablissement = await etablissementsDao.create(etablissement);

    return { success: true, body: createdetablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissements = async (query) => {
  try {
    const etablissements = await etablissementsDao.getAll(query);
    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.getOne(id);
    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.deleteOne(id);
    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateEtablissement = async (id, updatedEtablissement) => {
  try {
    const etablissement = await etablissementsDao.update(id, updatedEtablissement);

    if (!etablissement) throw new Error("Etablissement not found");

    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { createEtablissement, getEtablissements, getEtablissement, deleteEtablissement, updateEtablissement };
