const ObjectId = require("mongoose").mongo.ObjectId;
const Campagne = require("../models/campagne.model");

const temoignageCountQuery = [
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
];

const questionnaireTemplateQuery = [
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
      questionnaire: {
        $ifNull: [{ $arrayElemAt: ["$questionnaireTemplate.questionnaire", 0] }, "$questionnaire"],
      },
      questionnaireUI: {
        $ifNull: [{ $arrayElemAt: ["$questionnaireTemplate.questionnaireUI", 0] }, "$questionnaireUI"],
      },
    },
  },
  {
    $unset: ["questionnaireTemplate"],
  },
];

const formationQuery = [
  {
    $lookup: {
      from: "formations",
      let: { campagneId: { $toString: "$_id" } },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$$campagneId", "$campagneId"],
            },
          },
        },
        {
          $project: {
            _id: { $toString: "$_id" },
            "data.intitule_long": 1,
            "data.tags": 1,
            "data.lieu_formation_adresse_computed": 1,
          },
        },
        {
          $limit: 1,
        },
      ],
      as: "formation",
    },
  },
  {
    $addFields: {
      formation: { $arrayElemAt: ["$formation", 0] },
    },
  },
];

const etablissementQuery = [
  {
    $lookup: {
      from: "etablissements",
      let: { formationId: { $toString: "$formation._id" } },
      pipeline: [
        {
          $match: {
            $expr: {
              $in: ["$$formationId", "$formationIds"],
            },
          },
        },
        {
          $project: {
            _id: { $toString: "$_id" },
            "data.onisep_nom": 1,
            "data.enseigne": 1,
            "data.siret": 1,
          },
        },
        {
          $limit: 1,
        },
      ],
      as: "etablissement",
    },
  },
  {
    $addFields: {
      etablissement: { $arrayElemAt: ["$etablissement", 0] },
    },
  },
];

const getAllWithTemoignageCountAndTemplateName = async () => {
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
      },
    },
    ...temoignageCountQuery,
    ...questionnaireTemplateQuery,
    ...formationQuery,
    ...etablissementQuery,
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
    ...temoignageCountQuery,
    ...questionnaireTemplateQuery,
    ...formationQuery,
    ...etablissementQuery,
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
