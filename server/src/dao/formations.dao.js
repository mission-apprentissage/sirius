const Formation = require("../models/formation.model");

const create = async (formation) => {
  return Formation.create(formation);
};

const getAll = async (query) => {
  return Formation.find({ ...query, deletedAt: null }).lean();
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

const getDataIdFormationByIds = async (ids) => {
  return Formation.find({ "data._id": { $in: ids }, deletedAt: null })
    .select("data._id")
    .lean();
};

const getFormationByIntitule = async (intituleFormation) => {
  return Formation.aggregate([
    {
      $match: {
        deletedAt: null,
        "data.onisep_intitule": { $regex: new RegExp(`^${intituleFormation}$`, "i") },
      },
    },
    {
      $project: {
        campagneId: 1,
      },
    },
  ]);
};

const getFormationByUai = async (uai) => {
  return Formation.aggregate([
    {
      $match: {
        deletedAt: null,
        "data.etablissement_formateur_uai": uai,
      },
    },
    {
      $project: {
        campagneId: 1,
      },
    },
  ]);
};

const getAllWithTemoignageCount = async () => {
  return Formation.aggregate([
    {
      $match: { deletedAt: null },
    },
    {
      $group: {
        _id: "$data.onisep_intitule",
        formations: { $push: "$$ROOT" },
        campagneIds: { $addToSet: "$campagneId" },
      },
    },
    {
      $lookup: {
        from: "temoignages",
        localField: "campagneIds",
        foreignField: "campagneId",
        as: "temoignages",
      },
    },
    {
      $addFields: {
        temoignagesCount: { $size: "$temoignages" },
      },
    },
    {
      $project: {
        onisep_intitule: "$_id",
        temoignagesCount: 1,
      },
    },
    {
      $sort: {
        temoignagesCount: -1,
      },
    },
  ]);
};

module.exports = {
  create,
  getAll,
  getOne,
  getOneByDataId,
  deleteOne,
  update,
  deleteManyByCampagneIdAndReturnsTheDeletedFormationId,
  getDataIdFormationByIds,
  getFormationByIntitule,
  getFormationByUai,
  getAllWithTemoignageCount,
};
