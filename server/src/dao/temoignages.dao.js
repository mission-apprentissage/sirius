const Temoignage = require("../models/temoignage.model");

const create = async (temoignage) => {
  return Temoignage.create(temoignage);
};

const getAll = async (query, questionKey) => {
  let projection = { reponses: 1 };

  if (questionKey && typeof questionKey === "string") {
    projection = { [`reponses.${questionKey}`]: 1 };
    query = { ...query, [`reponses.${questionKey}`]: { $exists: true, $ne: null } };
  }

  projection = { ...projection, _id: 1, createdAt: 1, updatedAt: 1, campagneId: 1 };

  return Temoignage.find({ ...query, deletedAt: null }, projection).lean();
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
