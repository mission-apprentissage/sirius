const Questionnaire = require("../models/questionnaire.model");

const create = async (questionnaire) => {
  return Questionnaire.create(questionnaire);
};

const getAllWithCreatorName = async () => {
  return Questionnaire.aggregate([
    {
      $match: {
        deletedAt: null,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $project: {
        "createdBy.username": 0,
        "createdBy.authStrategy": 0,
        "createdBy.createdAt": 0,
        "createdBy.updatedAt": 0,
        "createdBy.salt": 0,
        "createdBy.hash": 0,
        "createdBy.refreshToken": 0,
      },
    },
  ]);
};

const deleteOne = async (id) => {
  return Questionnaire.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedQuestionnaire) => {
  return Questionnaire.updateOne({ _id: id, deletedAt: null }, updatedQuestionnaire);
};

module.exports = {
  create,
  getAllWithCreatorName,
  deleteOne,
  update,
};
