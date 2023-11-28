const Temoignage = require("../models/temoignage.model");

const create = async (temoignage) => {
  return Temoignage.create(temoignage);
};

const getAll = async (query) => {
  return Temoignage.find({ ...query, deletedAt: null }).lean();
};

const deleteOne = async (id) => {
  return Temoignage.updateOne({ _id: id }, { deletedAt: new Date() });
};

const deleteManyByCampagneId = async (ids) => {
  return Temoignage.updateMany({ campagneId: { $in: ids } }, { deletedAt: new Date() });
};

const update = async (id, updatedTemoignage) => {
  return Temoignage.updateOne({ _id: id, deletedAt: null }, updatedTemoignage);
};

const countByCampagne = async (id) => {
  return Temoignage.countDocuments({ campagneId: id, deletedAt: null });
};

const getOne = async (id) => {
  return Temoignage.findOne({ _id: id, deletedAt: null });
};

module.exports = {
  create,
  getAll,
  deleteOne,
  update,
  countByCampagne,
  getOne,
  deleteManyByCampagneId,
};
