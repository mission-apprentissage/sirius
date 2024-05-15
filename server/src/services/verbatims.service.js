const temoignagesDao = require("../dao/temoignages.dao");
const verbatimsDao = require("../dao/verbatims.dao");
const { ErrorMessage } = require("../errors");

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

const patchVerbatim = async (id, updatedVerbatim) => {
  try {
    const temoignageToUpdate = await temoignagesDao.getOne(id);

    if (!temoignageToUpdate) {
      return { success: false, body: ErrorMessage.TemoignageNotFoundError };
    }

    temoignageToUpdate.reponses[updatedVerbatim.questionId] = updatedVerbatim.payload;

    const updatedTemoignage = await temoignagesDao.update(id, temoignageToUpdate);

    return { success: true, body: updatedTemoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

const patchMultiVerbatim = async (verbatims) => {
  try {
    let updatedTemoignages = [];

    for (const verbatim of verbatims) {
      const temoignageToUpdate = await temoignagesDao.getOne(verbatim.temoignageId);
      if (!temoignageToUpdate) {
        return { success: false, body: ErrorMessage.TemoignageNotFoundError };
      }

      temoignageToUpdate.reponses[verbatim.questionId] = verbatim.payload;
      const updatedTemoignage = await temoignagesDao.update(verbatim.temoignageId, temoignageToUpdate);
      updatedTemoignages.push(updatedTemoignage);
    }

    return { success: true, body: updatedTemoignages };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getVerbatims, patchVerbatim, patchMultiVerbatim, getVerbatimsCount };
