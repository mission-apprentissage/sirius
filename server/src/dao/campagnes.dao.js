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

const formationQuery = (formationId) => {
  const objectIdFormationId = formationId ? new ObjectId(formationId) : null;
  return [
    {
      $lookup: {
        from: "formations",
        let: { campagneId: { $toString: "$_id" } },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$$campagneId", "$campagneId"] },
                  formationId ? { $eq: ["$_id", objectIdFormationId] } : {},
                  {
                    $or: [{ $eq: ["$deletedAt", null] }, { $not: { $gt: ["$deletedAt", null] } }],
                  },
                ],
              },
            },
          },
          {
            $project: {
              _id: { $toString: "$_id" },
              "data._id": 1,
              "data.intitule_long": 1,
              "data.tags": 1,
              "data.lieu_formation_adresse_computed": 1,
              "data.diplome": 1,
              "data.localite": 1,
              "data.duree": 1,
              "data.etablissement_formateur_siret": 1,
              "data.etablissement_gestionnaire_siret": 1,
              "data.etablissement_gestionnaire_enseigne": 1,
              "data.etablissement_formateur_enseigne": 1,
              "data.etablissement_formateur_entreprise_raison_sociale": 1,
              "data.etablissement_formateur_adresse": 1,
              "data.num_departement": 1,
              "data.region": 1,
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
};

const etablissementQuery = (sirets) => {
  const siretToArray = typeof sirets === "string" ? sirets.split(",") : sirets;
  const etablissementMatch = sirets && sirets.length > 0 ? { "etablissement.data.siret": { $in: siretToArray } } : {};
  return [
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
              formationIds: 1,
              "data.onisep_nom": 1,
              "data.enseigne": 1,
              "data.entreprise_raison_sociale": 1,
              "data.siret": 1,
              "data.numero_voie": 1,
              "data.type_voie": 1,
              "data.nom_voie": 1,
              "data.code_postal": 1,
              "data.localite": 1,
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
    {
      $match: {
        ...etablissementMatch,
      },
    },
  ];
};

const getAllWithTemoignageCountAndTemplateName = async (query, scope) => {
  const matchConditions = {
    deletedAt: null,
  };

  if (scope && scope.field && scope.value) {
    matchConditions[`formation.data.${scope.field}`] = scope.value;
  }

  return Campagne.aggregate([
    ...temoignageCountQuery,
    ...questionnaireTemplateQuery,
    ...formationQuery(),
    ...etablissementQuery(query?.siret),
    { $match: matchConditions },
  ]);
};

const getAllOnlyDiplomeTypeAndEtablissements = async (query) => {
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
      },
    },
    ...formationQuery(),
    ...etablissementQuery(query?.siret),
    {
      $project: {
        _id: { $toString: "$_id" },
        "formation.data._id": 1,
        "formation.data.intitule_long": 1,
        "formation.data.tags": 1,
        "formation.data.lieu_formation_adresse_computed": 1,
        "formation.data.diplome": 1,
        "formation.data.localite": 1,
        "formation.data.duree": 1,
        "formation.data.etablissement_formateur_siret": 1,
        "formation.data.etablissement_gestionnaire_siret": 1,
        "formation.data.etablissement_gestionnaire_enseigne": 1,
        "formation.data.etablissement_formateur_enseigne": 1,
        "formation.data.etablissement_formateur_entreprise_raison_sociale": 1,
        "formation.data.etablissement_formateur_adresse": 1,
      },
    },
  ]);
};

const getOne = async (id) => {
  return Campagne.findOne({ _id: id, deletedAt: null }).lean();
};

const getOneWithTemoignagneCountAndTemplateName = async (query) => {
  const idToObjectId = ObjectId(query.id);
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
        _id: idToObjectId,
      },
    },
    ...temoignageCountQuery,
    ...questionnaireTemplateQuery,
    ...formationQuery(),
    ...etablissementQuery(query.siret),
  ]);
};

const create = async (campagne) => {
  return Campagne.create(campagne);
};

const deleteOne = async (id) => {
  return Campagne.updateOne({ _id: id }, { deletedAt: new Date() });
};

const deleteMany = async (ids) => {
  return Campagne.updateMany({ _id: { $in: ids } }, { deletedAt: new Date() });
};

const update = async (id, updatedCampagne) => {
  return Campagne.updateOne({ _id: id, deletedAt: null }, updatedCampagne);
};

const getAllWithTemoignageCountFormationEtablissement = async (query = {}) => {
  return Campagne.aggregate([
    {
      $match: {
        deletedAt: null,
        ...(query.questionnaireId && { questionnaireId: query.questionnaireId }),
        ...(query._id && { _id: query._id }),
      },
    },
    ...temoignageCountQuery,
    ...formationQuery(query.formationId),
    ...etablissementQuery(query.etablissementSiret),
  ]);
};

const getAll = async (query = {}) => {
  return Campagne.find({ deletedAt: null, ...query }).lean();
};

module.exports = {
  getAllWithTemoignageCountAndTemplateName,
  getOneWithTemoignagneCountAndTemplateName,
  create,
  deleteOne,
  deleteMany,
  update,
  getAllWithTemoignageCountFormationEtablissement,
  getOne,
  getAll,
  getAllOnlyDiplomeTypeAndEtablissements,
};
