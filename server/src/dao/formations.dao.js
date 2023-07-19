const Formation = require("../models/formation.model");

const create = async (formation) => {
  return Formation.create(formation);
};

const getAll = async (query) => {
  return Formation.find({ ...query, deletedAt: null }).lean();
};

const getOne = (id) => {
  return Formation.findById(id).lean();
};

const deleteOne = async (id) => {
  return Formation.deleteOne({ _id: id });
};

const update = async (id, updatedFormation) => {
  return Formation.updateOne({ _id: id, deletedAt: null }, updatedFormation);
};

module.exports = {
  create,
  getAll,
  getOne,
  deleteOne,
  update,
};
