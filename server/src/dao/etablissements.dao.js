const Etablissement = require("../models/etablissement.model");

const create = async (etablissement) => {
  return Etablissement.create(etablissement);
};

const getAll = async (query) => {
  return Etablissement.find({ ...query, deletedAt: null }).lean();
};

const getOne = (id) => {
  return Etablissement.findById(id).lean();
};

const deleteOne = async (id) => {
  return Etablissement.updateOne({ _id: id }, { deletedAt: new Date() });
};

const update = async (id, updatedEtablissement) => {
  return Etablissement.updateOne({ _id: id, deletedAt: null }, updatedEtablissement);
};

const updateByFormationIds = async (idsToRemove) => {
  return Etablissement.updateMany(
    {
      formationIds: { $in: idsToRemove },
      deletedAt: null,
    },
    {
      $pull: { formationIds: { $in: idsToRemove } },
    }
  );
};

const getAllSuivi = async () => {
  return Etablissement.aggregate([
    {
      $match: {
        deletedAt: null,
      },
    },
    {
      $addFields: {
        convertedFormationIds: {
          $map: {
            input: "$formationIds",
            as: "formationId",
            in: { $toObjectId: "$$formationId" },
          },
        },
      },
    },
    {
      $lookup: {
        from: "formations",
        localField: "convertedFormationIds",
        foreignField: "_id",
        as: "formations",
      },
    },
    {
      $addFields: {
        campagneIdsString: "$formations.campagneId",
        campagneIdsObjectId: {
          $map: {
            input: "$formations.campagneId",
            as: "campagneId",
            in: { $toObjectId: "$$campagneId" },
          },
        },
      },
    },
    {
      $lookup: {
        from: "temoignages",
        localField: "campagneIdsString",
        foreignField: "campagneId",
        as: "temoignages",
      },
    },
    {
      $lookup: {
        from: "campagnes",
        localField: "campagneIdsObjectId",
        foreignField: "_id",
        as: "campagnes",
      },
    },
    {
      $lookup: {
        from: "questionnaires",
        localField: "campagnes.questionnaireId",
        foreignField: "_id",
        as: "campagnesQuestionnaires",
      },
    },
    {
      $addFields: {
        campagnes: {
          $map: {
            input: "$campagnes",
            as: "campagne",
            in: {
              $mergeObjects: [
                "$$campagne",
                {
                  questionnaire: {
                    $first: {
                      $filter: {
                        input: "$campagnesQuestionnaires",
                        as: "questionnaire",
                        cond: { $eq: ["$$questionnaire._id", { $toObjectId: "$$campagne.questionnaireId" }] },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        "data.siret": 1,
        "data.onisep_nom": 1,
        "data.enseigne": 1,
        "data.entreprise_raison_sociale": 1,
        "data.region_implantation_nom": 1,
        campagneIds: "$formations.campagneId",
        temoignages: 1,
        campagnes: 1,
      },
    },
  ]);
};

const count = (query) => {
  return Etablissement.countDocuments({ ...query, deletedAt: null });
};

const getAllWithTemoignageCount = async () => {
  return Etablissement.aggregate([
    { $match: { deletedAt: null } },
    {
      $addFields: {
        formationIds: {
          $map: {
            input: "$formationIds",
            as: "id",
            in: { $toObjectId: "$$id" },
          },
        },
      },
    },
    { $unwind: "$formationIds" },
    {
      $lookup: {
        from: "formations",
        localField: "formationIds",
        foreignField: "_id",
        as: "formationDetails",
      },
    },
    { $unwind: "$formationDetails" },
    { $match: { "formationDetails.deletedAt": null } },
    {
      $group: {
        _id: "$_id",
        formations: { $push: "$formationDetails" },
        etablissement: { $first: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: "$etablissement._id",
        onisep_nom: "$etablissement.data.onisep_nom",
        enseigne: "$etablissement.data.enseigne",
        entreprise_raison_sociale: "$etablissement.data.entreprise_raison_sociale",
        uai: "$etablissement.data.uai",
        formationIds: "$etablissement.formationIds",
        onisep_url: "$etablissement.data.onisep_url",
        localite: "$etablissement.data.localite",
        formations: 1,
      },
    },
    {
      $lookup: {
        from: "temoignages",
        localField: "formations.campagneId",
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
        onisep_nom: 1,
        enseigne: 1,
        entreprise_raison_sociale: 1,
        uai: 1,
        temoignagesCount: 1,
        onisep_url: 1,
        localite: 1,
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
  deleteOne,
  update,
  updateByFormationIds,
  getAllSuivi,
  count,
  getAllWithTemoignageCount,
};
