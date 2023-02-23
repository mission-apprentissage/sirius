const campagnesDao = require("../dao/campagnes.dao");

const getCampagnes = async () => {
  try {
    const campagnes = await campagnesDao.getAll();
    return { success: true, body: campagnes };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getOneCampagne = async (id) => {
  try {
    const campagne = await campagnesDao.getOne(id);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const createCampagne = async (campagne) => {
  try {
    const createdCampagne = await campagnesDao.create(campagne);
    return { success: true, body: createdCampagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteCampagne = async (id) => {
  try {
    const campagne = await campagnesDao.deleteOne(id);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getCampagnes, getOneCampagne, createCampagne, deleteCampagne };