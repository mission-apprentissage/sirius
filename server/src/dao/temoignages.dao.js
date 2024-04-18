const ObjectId = require("mongoose").mongo.ObjectId;
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

  projection = {
    ...projection,
    _id: 1,
    createdAt: 1,
    updatedAt: 1,
    campagneId: 1,
    lastQuestionAt: 1,
    isBot: 1,
    deletedAt: 1,
  };

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

const getAllTemoignagesWithFormation = async (query = {}, page, pageSize) => {
  return Temoignage.aggregate([
    {
      $match: {
        $and: [
          { ...query },
          {
            $or: [{ deletedAt: { $eq: null } }, { deletedAt: { $exists: false } }],
          },
        ],
      },
    },
    {
      $lookup: {
        from: "formations",
        localField: "campagneId",
        foreignField: "campagneId",
        as: "formation",
      },
    },
    {
      $facet: {
        totalCount: [{ $count: "total" }],
        data: [
          { $skip: (parseInt(page) - 1) * parseInt(pageSize) },
          { $limit: parseInt(pageSize) },
          {
            $project: {
              _id: 1,
              reponses: 1,
              campagneId: 1,
              createdAt: 1,
              updatedAt: 1,
              lastQuestionAt: 1,
              isBot: 1,
              deletedAt: 1,
              formation: 1,
            },
          },
          { $unwind: { path: "$formation", preserveNullAndEmptyArrays: true } },
          { $replaceRoot: { newRoot: "$$ROOT" } },
        ],
      },
    },
    {
      $project: {
        totalCount: { $arrayElemAt: ["$totalCount.total", 0] },
        data: "$data",
      },
    },
  ]);
};

const count = async (query) => {
  return Temoignage.countDocuments({
    $and: [
      { ...query },
      {
        $or: [{ deletedAt: { $eq: null } }, { deletedAt: { $exists: false } }],
      },
    ],
  });
};

const deleteMultiple = async (ids) => {
  const objectIds = ids.map((id) => ObjectId(id));

  return Temoignage.updateMany({ _id: { $in: objectIds } }, { deletedAt: new Date() });
};

module.exports = {
  create,
  getAll,
  deleteOne,
  update,
  countByCampagne,
  getOne,
  deleteManyByCampagneId,
  getAllTemoignagesWithFormation,
  count,
  deleteMultiple,
};
