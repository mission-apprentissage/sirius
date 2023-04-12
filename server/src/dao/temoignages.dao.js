const Temoignage = require("../models/temoignage.model");

const create = async (temoignage) => {
  return Temoignage.create(temoignage);
};

const getAll = async (query) => {
  return Temoignage.find(query).lean();
};

const deleteOne = async (id) => {
  return Temoignage.deleteOne({ _id: id });
};

module.exports = {
  create,
  getAll,
  deleteOne,
};
