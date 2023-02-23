const temoignagesDao = require("../dao/temoignages.dao");

const createTemoignage = async (temoignage) => {
  try {
    const createdTemoignage = await temoignagesDao.create(temoignage);
    return { success: true, body: createdTemoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { createTemoignage };
