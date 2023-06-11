const campagnesDao = require("../dao/campagnes.dao");

const getCampagnes = async () => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCount();
    return { success: true, body: campagnes };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getOneCampagne = async (id) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCount(id);
    console.log({ campagne });
    return { success: true, body: campagne[0] };
  } catch (error) {
    console.log({ error });
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

const updateCampagne = async (id, updatedCampagne) => {
  try {
    const campagne = await campagnesDao.update(id, updatedCampagne);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getCampagnes, getOneCampagne, createCampagne, deleteCampagne, updateCampagne };
