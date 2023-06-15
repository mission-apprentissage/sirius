const Campagne = require("../models/campagne.model");

const getAll = async () => {
  return Campagne.find({ deletedAt: null }).lean();
};

const getOne = async (id) => {
  return Campagne.findOne({ _id: id, deletedAt: null }).lean();
};

const create = async (campagne) => {
  return Campagne.create(campagne);
};

const deleteOne = async (id) => {
  return Campagne.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedCampagne) => {
  return Campagne.updateOne({ _id: id, deletedAt: null }, updatedCampagne);
};

module.exports = {
  getAll,
  getOne,
  create,
  deleteOne,
  update,
};
