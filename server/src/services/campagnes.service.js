const ObjectId = require("mongoose").mongo.ObjectId;

const campagnesDao = require("../dao/campagnes.dao");
const formationsDao = require("../dao/formations.dao");
const etablissementsDao = require("../dao/etablissements.dao");

const { getChampsLibreRate } = require("../utils/verbatims.utils");
const { getMedianDuration } = require("../utils/campagnes.utils");
const { generatePdf, generateMultiplePdf } = require("../modules/pdfExport");
const { DIPLOME_TYPE_MATCHER } = require("../constants");

const getCampagnes = async (query) => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName(query);
    campagnes.forEach((campagne) => {
      campagne.champsLibreRate = getChampsLibreRate(campagne.questionnaireUI, campagne.temoignagesList);
    });
    campagnes.forEach((campagne) => {
      campagne.medianDurationInMs = getMedianDuration(campagne.temoignagesList);
      delete campagne.temoignagesList;
    });
    return { success: true, body: campagnes };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getOneCampagne = async (query) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(query);
    return { success: true, body: campagne[0] };
  } catch (error) {
    return { success: false, body: error };
  }
};

const createCampagne = async (campagne) => {
  try {
    const createdCampagne = await campagnesDao.create(campagne);
    return { success: true, body: createdCampagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteCampagne = async (id) => {
  try {
    const campagne = await campagnesDao.deleteOne(id);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateCampagne = async (id, updatedCampagne) => {
  try {
    const campagne = await campagnesDao.update(id, updatedCampagne);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const createMultiCampagne = async ({ campagnes, etablissementSiret }) => {
  try {
    const formationsIds = [];

    for (const campagne of campagnes) {
      // eslint-disable-next-line no-unused-vars
      const { formation } = campagne;

      const createdCampagne = await campagnesDao.create(campagne);
      const createdFormation = await formationsDao.create({
        data: formation,
        campagneId: createdCampagne._id,
        createdBy: formation.createdBy,
      });

      formationsIds.push(createdFormation._id.toString());
    }

    const etablissement = await etablissementsDao.getAll({ "data.siret": etablissementSiret });

    await etablissementsDao.update(etablissement[0]._id, {
      formationIds: [...etablissement[0].formationIds, ...formationsIds],
    });
    return { success: true, body: { createdCount: formationsIds.length } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getExport = async (id) => {
  try {
    const campagne = await campagnesDao.getOne(id);

    const formation = await formationsDao.getAll({ campagneId: id });

    const campagneName = campagne.nomCampagne || formation[0].data.intitule_long || formation[0].data.intitule_court;

    const generatedPdf = await generatePdf(campagne._id, campagneName);

    return { success: true, body: { data: generatedPdf, fileName: campagneName + ".pdf" } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getMultipleExport = async (ids, user) => {
  try {
    const query = { _id: { $in: ids.map((id) => ObjectId(id)) } };

    const campagnes = await campagnesDao.getAll(query);

    const formattedCampagnes = campagnes.map((campagne) => ({
      campagneId: campagne._id.toString(),
      campagneName:
        campagne.nomCampagne || campagne.formation.data.intitule_long || campagne.formation.data.intitule_court,
      localite: campagne.formation.data.localite,
      tags: campagne.formation.data.tags,
      duree: campagne.formation.data.duree,
    }));

    const etablissementLabel =
      campagnes[0].etablissement.data.onisep_nom ||
      campagnes[0].etablissement.data.enseigne ||
      campagnes[0].etablissement.data.entreprise_raison_sociale ||
      "";

    const diplome = DIPLOME_TYPE_MATCHER[campagnes[0].formation.data.diplome];

    const generatedPdf = await generateMultiplePdf(formattedCampagnes, diplome, etablissementLabel, user);

    const diplomeName = campagnes[0].formation.data.diplome;

    const fileName = `campagnes Sirius - ${DIPLOME_TYPE_MATCHER[diplomeName] || diplomeName}.pdf`;

    return {
      success: true,
      body: { data: generatedPdf, fileName },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  getCampagnes,
  getOneCampagne,
  createCampagne,
  deleteCampagne,
  updateCampagne,
  createMultiCampagne,
  getExport,
  getMultipleExport,
};
