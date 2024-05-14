const ObjectId = require("mongoose").mongo.ObjectId;
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

const getAllWithFormation = async (query = {}, page = 1, pageSize = 100) => {
  const offset = (page - 1) * pageSize;

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
              "formation.data.intitule_long": 1,
              "formation.data.etablissement_formateur_enseigne": 1,
              "formation.data.etablissement_formateur_entreprise_raison_sociale": 1,
              "formation.data.etablissement_formateur_siret": 1,
            },
          },
        ],
      },
    },
  ]);
};

module.exports = {
  count,
  getAll,
  getAllWithFormation,
};
