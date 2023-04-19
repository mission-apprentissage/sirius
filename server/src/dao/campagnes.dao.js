const Campagne = require("../models/campagne.model");

const getAll = async () => {
  return Campagne.find({}).lean();
};

const getOne = async (id) => {
  return Campagne.findOne({ _id: id }).lean();
};

const create = async (campagne) => {
  return Campagne.create(campagne);
};

const deleteOne = async (id) => {
  return Campagne.deleteOne({ _id: id });
};

const update = async (id, updatedCampagne) => {
  return Campagne.updateOne({ _id: id }, updatedCampagne);
};

module.exports = {
  getAll,
  getOne,
  create,
  deleteOne,
  update,
};
