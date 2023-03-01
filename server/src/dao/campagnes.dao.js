const Campagne = require("../models/campagne.model");

const getAll = async () => {
  return Campagne.find({});
};

const getOne = async (id) => {
  return Campagne.findOne({ _id: id });
};

const create = async (campagne) => {
  return Campagne.create(campagne);
};

const deleteOne = async (id) => {
  return Campagne.deleteOne({ _id: id });
};

const update = async (id, updatedCampagne) => {
  return Campagne.replaceOne({ _id: id }, updatedCampagne);
};

module.exports = {
  getAll,
  getOne,
  create,
  deleteOne,
  update,
};
