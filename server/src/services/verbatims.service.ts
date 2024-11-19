// @ts-nocheck -- TODO

import * as verbatimsDao from "../dao/verbatims.dao";

export const getVerbatims = async ({ etablissementSiret, formationId, status, onlyDiscrepancies, page, pageSize }) => {
  try {
    const query = {};

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

export const getVerbatimsCount = async ({ etablissementSiret, formationId }) => {
  try {
    const query = {};

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

export const patchVerbatims = async (verbatims) => {
  try {
    const result = await verbatimsDao.updateMany(verbatims);
    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const createVerbatim = async (verbatim) => {
  try {
    const existingVerbatim = await verbatimsDao.getOneByTemoignageIdAndQuestionKey({
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

export const feedbackVerbatim = async (id, isUseful) => {
  try {
    const currentVerbatim = await verbatimsDao.getOneById(id);

    if (!currentVerbatim) {
      return { success: false, body: "Verbatim not found" };
    }

    const newFeedbackValue = isUseful ? currentVerbatim.feedbackCount + 1 : currentVerbatim.feedbackCount - 1;

    const result = await verbatimsDao.updateOne(id, { feedback_count: newFeedbackValue });

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};
