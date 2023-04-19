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

const update = async (id, updatedCampagne) => {
  return Temoignage.updateOne({ _id: id }, updatedCampagne);
};

module.exports = {
  create,
  getAll,
  deleteOne,
  update,
};
