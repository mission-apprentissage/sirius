const ObjectId = require("mongoose").mongo.ObjectId;
const { VERBATIM_STATUS } = require("../constants");
const Verbatim = require("../models/verbatim.model");

const count = (query = {}) => {
  if (query.etablissementSiret) {
    query["formation.data.etablissement_formateur_siret"] = query.etablissementSiret;
    delete query.etablissementSiret;
  }

  if (query.formationId) {
    query["formation._id"] = ObjectId(query.formationId);
    delete query.formationId;
  }

  return Verbatim.aggregate([
    {
      $lookup: {
        from: "temoignages",
        localField: "temoignageId",
        foreignField: "_id",
        as: "temoignage",
      },
    },
    {
      $lookup: {
        from: "formations",
        localField: "temoignage.campagneId",
        foreignField: "campagneId",
        as: "formation",
      },
    },
    { $unwind: "$temoignage" },
    { $unwind: "$formation" },
    { $match: { ...query, deletedAt: null } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
      },
    },
  ]);
};

const getAll = ({ query }) => {
  return Verbatim.find({ ...query, deletedAt: null });
};

const getAllWithFormation = async (query = {}, onlyDiscrepancies, page = 1, pageSize = 100) => {
  const offset = (page - 1) * pageSize;

  if (query.etablissementSiret) {
    query["formation.data.etablissement_formateur_siret"] = query.etablissementSiret;
    delete query.etablissementSiret;
  }

  if (query.formationId) {
    query["formation._id"] = ObjectId(query.formationId);
    delete query.formationId;
  }

  const aggregationPipeline = [
    {
      $lookup: {
        from: "temoignages",
        localField: "temoignageId",
        foreignField: "_id",
        as: "temoignage",
      },
    },
    { $unwind: "$temoignage" },
    {
      $lookup: {
        from: "formations",
        localField: "temoignage.campagneId",
        foreignField: "campagneId",
        as: "formation",
      },
    },
    { $unwind: { path: "$formation", preserveNullAndEmptyArrays: true } },
    { $match: { ...query, deletedAt: null } },
  ];

  if (onlyDiscrepancies) {
    aggregationPipeline.push({
      $addFields: {
        maxScoreKey: {
          $cond: {
            if: { $eq: ["$scores.GEM.avis", "oui"] },
            then: { k: VERBATIM_STATUS.GEM, v: "$scores.GEM.justification" },
            else: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: [
                      { k: "VALIDATED", v: "$scores.VALIDATED" },
                      { k: "REJECTED", v: "$scores.REJECTED" },
                      { k: "TO_FIX", v: "$scores.TO_FIX" },
                      { k: "ALERT", v: "$scores.ALERT" },
                    ],
                    as: "item",
                    cond: {
                      $eq: [
                        "$$item.v",
                        {
                          $max: ["$scores.VALIDATED", "$scores.REJECTED", "$scores.TO_FIX", "$scores.ALERT"],
                        },
                      ],
                    },
                  },
                },
                0,
              ],
            },
          },
        },
      },
    });
    aggregationPipeline.push({
      $match: {
        $and: [{ "maxScoreKey.k": { $ne: null } }, { $expr: { $ne: ["$maxScoreKey.k", "$status"] } }],
      },
    });
  }
  aggregationPipeline.push({
    $facet: {
      pagination: [{ $count: "totalItems" }, { $addFields: { currentPage: page, pageSize: pageSize } }],
      body: [
        { $skip: offset },
        { $limit: pageSize },
        {
          $project: {
            _id: 1,
            questionKey: 1,
            content: 1,
            status: 1,
            createdAt: 1,
            scores: 1,
            maxScoreKey: 1,
            "formation.data.intitule_long": 1,
            "formation.data.etablissement_formateur_enseigne": 1,
            "formation.data.etablissement_formateur_entreprise_raison_sociale": 1,
            "formation.data.etablissement_formateur_siret": 1,
          },
        },
      ],
    },
  });

  return Verbatim.aggregate(aggregationPipeline);
};

const updateOne = async (query, update) => {
  return Verbatim.updateOne(query, update);
};

const updateMany = async (verbatims) => {
  const results = await Promise.all(
    verbatims.map(({ _id, ...update }) => {
      return Verbatim.updateMany({ _id: ObjectId(_id) }, { $set: update });
    })
  );

  return results;
};

const create = async (verbatim) => {
  return Verbatim.create(verbatim);
};

const findOne = async (query) => {
  return Verbatim.findOne(query);
};

module.exports = {
  count,
  getAll,
  getAllWithFormation,
  updateMany,
  create,
  updateOne,
  findOne,
};
