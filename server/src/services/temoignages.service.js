const temoignagesDao = require("../dao/temoignages.dao");

const createTemoignage = async (temoignage) => {
  try {
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
