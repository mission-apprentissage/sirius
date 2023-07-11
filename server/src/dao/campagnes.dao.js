const ObjectId = require("mongoose").mongo.ObjectId;
const Campagne = require("../models/campagne.model");

const getAllWithTemoignageCountAndTemplateName = async () => {
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
      },
    },
    {
      $lookup: {
        from: "temoignages",
        let: { campagneId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $toObjectId: "$campagneId" }, "$$campagneId"] },
                  {
                    $or: [{ $eq: ["$deletedAt", null] }, { $not: { $gt: ["$deletedAt", null] } }],
                  },
                ],
              },
            },
          },
        ],
        as: "temoignagesList",
      },
    },
    {
      $addFields: {
        temoignagesCount: { $size: "$temoignagesList" },
      },
    },
    {
      $unset: ["temoignagesList"],
    },
    {
      $lookup: {
        from: "questionnaires",
        let: { questionnaireId: { $toObjectId: "$questionnaireId" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$questionnaireId"],
              },
            },
          },
        ],
        as: "questionnaireTemplate",
      },
    },
    {
      $addFields: {
        questionnaireTemplateName: { $arrayElemAt: ["$questionnaireTemplate.nom", 0] },
      },
    },
    {
      $unset: ["questionnaireTemplate"],
    },
  ]);
};

const getOneWithTemoignagneCountAndTemplateName = async (id) => {
  const idToObjectId = ObjectId(id);
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
        _id: idToObjectId,
      },
    },
    {
      $lookup: {
        from: "temoignages",
        let: { campagneId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $toObjectId: "$campagneId" }, "$$campagneId"] },
                  {
                    $or: [{ $eq: ["$deletedAt", null] }, { $not: { $gt: ["$deletedAt", null] } }],
                  },
                ],
              },
            },
          },
        ],
        as: "temoignagesList",
      },
    },
    {
      $addFields: {
        temoignagesCount: { $size: "$temoignagesList" },
      },
    },
    {
      $unset: ["temoignagesList"],
    },
    {
      $lookup: {
        from: "questionnaires",
        let: { questionnaireId: { $toObjectId: "$questionnaireId" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$questionnaireId"],
              },
            },
          },
        ],
        as: "questionnaireTemplate",
      },
    },
    {
      $addFields: {
        questionnaireTemplateName: { $arrayElemAt: ["$questionnaireTemplate.nom", 0] },
      },
    },
    {
      $unset: ["questionnaireTemplate"],
    },
  ]);
};

const create = async (campagne) => {
  return Campagne.create(campagne);
};

const deleteOne = async (id) => {
  return Campagne.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedCampagne) => {
  return Campagne.updateOne({ _id: id, deletedAt: null }, updatedCampagne);
};

module.exports = {
  getAllWithTemoignageCountAndTemplateName,
  getOneWithTemoignagneCountAndTemplateName,
  create,
  deleteOne,
  update,
};
