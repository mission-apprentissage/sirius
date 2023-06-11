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

const countByCampagne = async (id) => {
  return Temoignage.countDocuments({ campagneId: id, deletedAt: null });
};

module.exports = {
  create,
  getAll,
  deleteOne,
  update,
  countByCampagne,
};
