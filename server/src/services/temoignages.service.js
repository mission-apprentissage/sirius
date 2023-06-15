const temoignagesDao = require("../dao/temoignages.dao");
const campagnesDao = require("../dao/campagnes.dao");
const { ErrorMessage } = require("../errors");

const createTemoignage = async (temoignage) => {
  try {
    const campagne = await campagnesDao.getOne(temoignage.campagneId);

    if (!campagne) throw new Error("Campagne not found");

    if (new Date(campagne.startDate) > new Date()) {
      return { success: false, body: ErrorMessage.CampagneNotStarted };
    }
    if (new Date(campagne.endDate) < new Date()) {
      return { success: false, body: ErrorMessage.CampagneEnded };
    }
    const createdTemoignage = await temoignagesDao.create(temoignage);

    return { success: true, body: createdTemoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getTemoignages = async (query) => {
  try {
    const temoignages = await temoignagesDao.getAll(query);
    return { success: true, body: temoignages };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteTemoignage = async (id) => {
  try {
    const temoignage = await temoignagesDao.deleteOne(id);
    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateTemoignage = async (id, updatedTemoignage) => {
  try {
    const temoignage = await temoignagesDao.update(id, updatedTemoignage);
    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { createTemoignage, getTemoignages, deleteTemoignage, updateTemoignage };
