const Formation = require("../models/formation.model");

const create = async (formation) => {
  return Formation.create(formation);
};

const getAll = async (query) => {
  let queryBuilder;
  if (query?.id) {
    queryBuilder = { _id: { $in: query.id } };
  } else {
    queryBuilder = { ...query };
  }
  return Formation.find({ ...queryBuilder, deletedAt: null }).lean();
};

const getOne = (id) => {
  return Formation.findById(id).lean();
};

const getOneByDataId = (id) => {
  const query = {
    "data._id": id,
  };
  return Formation.find({ ...query, deletedAt: null }).lean();
};

const deleteOne = async (id) => {
  return Formation.deleteOne({ _id: id });
};

const deleteManyByCampagneIdAndReturnsTheDeletedFormationId = async (ids) => {
  const formations = await Formation.find({ campagneId: { $in: ids } }).select("_id");

  const formationIds = formations.map((formation) => formation._id);

  await Formation.updateMany({ _id: { $in: formationIds } }, { deletedAt: new Date() });

  return formationIds;
};

const update = async (id, updatedFormation) => {
  return Formation.updateOne({ _id: id, deletedAt: null }, updatedFormation);
};

module.exports = {
  create,
  getAll,
  getOne,
  getOneByDataId,
  deleteOne,
  update,
  deleteManyByCampagneIdAndReturnsTheDeletedFormationId,
};
