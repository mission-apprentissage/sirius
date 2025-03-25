import type { VERBATIM_STATUS } from "../constants";
import * as verbatimsDao from "../dao/verbatims.dao";
import type { VerbatimCreation } from "../types";

export const getVerbatims = async ({
  etablissementSiret,
  formationId,
  status,
  onlyDiscrepancies,
  page,
  pageSize,
}: {
  etablissementSiret: string | null;
  formationId: string | null;
  status: string | null;
  onlyDiscrepancies: boolean;
  page: number;
  pageSize: number;
}) => {
  try {
    const query: {
      etablissementSiret?: string;
      formationId?: string;
      status?: string;
    } = {};

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

export const getVerbatimsCount = async ({
  etablissementSiret,
  formationId,
}: {
  etablissementSiret: string | null;
  formationId: string | null;
}) => {
  try {
    const query: {
      etablissementSiret?: string;
      formationId?: string;
    } = {};

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

export const patchVerbatims = async (
  verbatims: {
    id: string;
    status: (typeof VERBATIM_STATUS)[keyof typeof VERBATIM_STATUS];
  }[]
) => {
  try {
    const result = await verbatimsDao.updateMany(verbatims);
    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const createVerbatim = async (verbatim: VerbatimCreation) => {
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

export const feedbackVerbatim = async (id: string, isUseful: boolean) => {
  try {
    const currentVerbatim = await verbatimsDao.getOneById(id);

    if (!currentVerbatim) {
      return { success: false, body: "Verbatim not found" };
    }

    if (!currentVerbatim.feedbackCount) {
      currentVerbatim.feedbackCount = 0;
    }

    const newFeedbackValue = isUseful ? currentVerbatim.feedbackCount + 1 : currentVerbatim.feedbackCount - 1;

    const result = await verbatimsDao.updateOne(id, { feedbackCount: newFeedbackValue });

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};
