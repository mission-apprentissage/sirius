const Questionnaire = require("../models/questionnaire.model");

const create = async (questionnaire) => {
  return Questionnaire.create(questionnaire);
};

const getAll = async (query) => {
  return Questionnaire.find({ ...query, deletedAt: null }).lean();
};

const deleteOne = async (id) => {
  return Questionnaire.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedQuestionnaire) => {
  return Questionnaire.updateOne({ _id: id, deletedAt: null }, updatedQuestionnaire);
};

module.exports = {
  create,
  getAll,
  deleteOne,
  update,
};
