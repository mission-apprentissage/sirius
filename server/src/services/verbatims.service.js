const ObjectId = require("mongoose").mongo.ObjectId;
const verbatimsDao = require("../dao/verbatims.dao");

const getVerbatims = async ({ etablissementSiret, formationId, status, onlyDiscrepancies, page, pageSize }) => {
  try {
    let query = {};

    if (etablissementSiret) {
      query.etablissementSiret = etablissementSiret;
    }

    if (formationId) {
      query.formationId = formationId;
    }

    if (status) {
      query.status = status;
    }

    const result = await verbatimsDao.getAllWithFormation(query, onlyDiscrepancies, page, pageSize);

    return {
      success: true,
      body: result[0].body,
      pagination: {
        ...result[0].pagination[0],
        totalPages: Math.ceil(result[0]?.pagination[0]?.totalItems / pageSize),
        hasMore: result[0].pagination[0]?.totalItems > page * pageSize,
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getVerbatimsCount = async ({ etablissementSiret, formationId }) => {
  try {
    let query = {};

    if (etablissementSiret) {
      query.etablissementSiret = etablissementSiret;
    }

    if (formationId) {
      query.formationId = formationId;
    }

    const count = await verbatimsDao.count(query);

    return { success: true, body: count };
  } catch (error) {
    return { success: false, body: error };
  }
};

const patchVerbatims = async (verbatims) => {
  try {
    const result = await verbatimsDao.updateMany(verbatims);

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

const createVerbatim = async (verbatim) => {
  try {
    const existingVerbatim = await verbatimsDao.findOne({
      temoignageId: ObjectId(verbatim.temoignageId),
      questionKey: verbatim.questionKey,
    });

    let result;

    if (existingVerbatim?._id) {
      result = await verbatimsDao.updateOne({ _id: ObjectId(existingVerbatim._id) }, verbatim);
    } else {
      result = await verbatimsDao.create(verbatim);
    }

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getVerbatims, patchVerbatims, getVerbatimsCount, createVerbatim };
