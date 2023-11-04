const Questionnaire = require("../models/questionnaire.model");

const create = async (questionnaire) => {
  return Questionnaire.create(questionnaire);
};

const getAllWithCreatorName = async (query) => {
  return Questionnaire.aggregate([
    {
      $match: {
        deletedAt: null,
        ...query,
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
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        "createdBy.email": 0,
        "createdBy.authStrategy": 0,
        "createdBy.createdAt": 0,
        "createdBy.updatedAt": 0,
        "createdBy.salt": 0,
        "createdBy.hash": 0,
        "createdBy.refreshToken": 0,
        "createdBy.emailConfirmed": 0,
        "createdBy.role": 0,
        "createdBy.status": 0,
        "createdBy.comment": 0,
        "createdBy.etablissements": 0,
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

const getOne = (id) => {
  return Questionnaire.findById(id).lean();
};

module.exports = {
  create,
  getAllWithCreatorName,
  deleteOne,
  update,
  getOne,
};
