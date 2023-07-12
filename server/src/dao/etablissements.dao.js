const Etablissement = require("../models/etablissement.model");

const create = async (etablissement) => {
  return Etablissement.create(etablissement);
};

const getAll = async (query) => {
  return Etablissement.find({ ...query, deletedAt: null }).lean();
};

const getOne = (id) => {
  return Etablissement.findById(id).lean();
};

const deleteOne = async (id) => {
  return Etablissement.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedEtablissement) => {
  return Etablissement.updateOne({ _id: id, deletedAt: null }, updatedEtablissement);
};

module.exports = {
  create,
  getAll,
  getOne,
  deleteOne,
  update,
};
