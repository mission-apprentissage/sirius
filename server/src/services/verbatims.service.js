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

    // needed because of camelCase to snake_case conversion from kysely plugin
    result.rows.forEach((verbatim) => {
      if (verbatim?.scores) {
        verbatim.scores.TO_FIX = verbatim.scores?.TOFIX;
        verbatim.scores.NOT_VALIDATED = verbatim.scores?.NOTVALIDATED;
        delete verbatim.scores.TOFIX;
        delete verbatim.scores.NOTVALIDATED;
      }
    });

    const count = await verbatimsDao.count(query);
    const totalItemsByStatus = count.filter((c) => c.status === status)[0]?.count;
    const totalPagesByStatus = Math.ceil(totalItemsByStatus / pageSize);

    return {
      success: true,
      body: result.rows,
      pagination: {
        totalPages: totalPagesByStatus,
        hasMore: result.hasNextPage,
        pageSize: pageSize,
        currentPage: page,
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
    const existingVerbatim = await verbatimsDao.getOne({
      temoignageId: verbatim.temoignageId,
      questionKey: verbatim.questionKey,
    });

    let result;

    if (existingVerbatim?.id) {
      result = await verbatimsDao.updateOne(existingVerbatim.id, verbatim);
    } else {
      result = await verbatimsDao.create(verbatim);
    }

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getVerbatims, patchVerbatims, getVerbatimsCount, createVerbatim };
