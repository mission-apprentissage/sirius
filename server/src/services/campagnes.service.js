const ObjectId = require("mongoose").mongo.ObjectId;

const campagnesDao = require("../dao/campagnes.dao");
const formationsDao = require("../dao/formations.dao");
const etablissementsDao = require("../dao/etablissements.dao");
const temoignagesDao = require("../dao/temoignages.dao");

const { getChampsLibreRate, getChampsLibreCount } = require("../utils/verbatims.utils");
const { getMedianDuration, appendDataWhenEmpty } = require("../utils/campagnes.utils");
const pdfExport = require("../modules/pdfExport");
const { DIPLOME_TYPE_MATCHER, ETABLISSEMENT_NATURE, ETABLISSEMENT_RELATION_TYPE } = require("../constants");
const referentiel = require("../modules/referentiel");
const xlsxExport = require("../modules/xlsxExport");
const { getEtablissement } = require("../modules/catalogue");

const getCampagnes = async (isAdmin, userSiret) => {
  try {
    let campagnes = [];

    if (isAdmin) {
      campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName();
    }

    for (const siret of userSiret) {
      let etablissementsSiret = [siret];

      const etablissementNature = await referentiel.getEtablissementNature(siret);

      const isGestionnaire =
        etablissementNature === ETABLISSEMENT_NATURE.GESTIONNAIRE ||
        etablissementNature === ETABLISSEMENT_NATURE.GESTIONNAIRE_FORMATEUR;
      const isFormateur =
        etablissementNature === ETABLISSEMENT_NATURE.FORMATEUR ||
        etablissementNature === ETABLISSEMENT_NATURE.GESTIONNAIRE_FORMATEUR;

      if (isGestionnaire) {
        const etablissementFormateurSIRET = await referentiel.getEtablissementSIRETFromRelationType(
          siret,
          ETABLISSEMENT_RELATION_TYPE.RESPONSABLE_FORMATEUR
        );

        etablissementsSiret.push(...etablissementFormateurSIRET);

        const fetchedCampagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({
          siret: etablissementsSiret,
        });

        campagnes.push(fetchedCampagnes);
      } else if (isFormateur) {
        const etablissementGestionnaireSiret = await referentiel.getEtablissementSIRETFromRelationType(
          siret,
          ETABLISSEMENT_RELATION_TYPE.FORMATEUR_RESPONSABLE
        );
        etablissementsSiret.push(...etablissementGestionnaireSiret);

        const allCampagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({
          siret: etablissementsSiret,
        });

        const filteredCampagnes = allCampagnes.filter(
          (campagne) => campagne.formation.data.etablissement_formateur_siret === siret
        );
        campagnes.push(filteredCampagnes);
      }
    }

    const flattenCampagnesArray = campagnes.flat();

    flattenCampagnesArray.forEach((campagne) => {
      campagne.champsLibreCount = getChampsLibreCount(campagne.questionnaireUI, campagne.temoignagesList);
    });
    flattenCampagnesArray.forEach((campagne) => {
      campagne.champsLibreRate = getChampsLibreRate(campagne.questionnaireUI, campagne.temoignagesList);
      delete campagne.questionnaireUI;
      delete campagne.questionnaire;
    });
    flattenCampagnesArray.forEach((campagne) => {
      campagne.medianDurationInMs = getMedianDuration(campagne.temoignagesList);
      delete campagne.temoignagesList;
    });

    flattenCampagnesArray.forEach((campagne) => appendDataWhenEmpty(campagne));

    return { success: true, body: flattenCampagnesArray };
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

const deleteCampagnes = async (ids) => {
  try {
    const deletedCampagnes = await campagnesDao.deleteMany(ids);
    await temoignagesDao.deleteManyByCampagneId(ids);
    const deletedFormationsIds = await formationsDao.deleteManyByCampagneIdAndReturnsTheDeletedFormationId(ids);

    const deletedFormationsStringifiedIds = deletedFormationsIds.map((id) => id.toString());

    await etablissementsDao.updateByFormationIds(deletedFormationsStringifiedIds);

    return { success: true, body: deletedCampagnes };
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

const createMultiCampagne = async (campagnes) => {
  try {
    const formationsIds = [];

    for (const campagne of campagnes) {
      const { formation, etablissementFormateurSiret } = campagne;

      const createdCampagne = await campagnesDao.create(campagne);
      const createdFormation = await formationsDao.create({
        data: formation,
        campagneId: createdCampagne._id,
        createdBy: formation.createdBy,
      });

      formationsIds.push(createdFormation._id.toString());
      const etablissement = await etablissementsDao.getAll({ "data.siret": etablissementFormateurSiret });

      if (etablissement.length) {
        await etablissementsDao.update(etablissement[0]._id, {
          formationIds: [...etablissement[0].formationIds, createdFormation._id.toString()],
        });
      } else {
        const etablissement = await getEtablissement(etablissementFormateurSiret);
        await etablissementsDao.create({
          data: etablissement,
          formationIds: [createdFormation._id.toString()],
          createdBy: formation.createdBy,
        });
      }
    }

    return { success: true, body: { createdCount: formationsIds.length } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getPdfExport = async (id) => {
  try {
    const campagne = await campagnesDao.getOne(id);

    const formation = await formationsDao.getAll({ campagneId: id });

    const campagneName = campagne.nomCampagne || formation[0].data.intitule_long || formation[0].data.intitule_court;

    const generatedPdf = await pdfExport.generatePdf(campagne._id, campagneName);

    return { success: true, body: { data: generatedPdf, fileName: campagneName + ".pdf" } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getPdfMultipleExport = async (ids, user) => {
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

    const diplome = DIPLOME_TYPE_MATCHER[campagnes[0].formation.data.diplome] || campagnes[0].formation.data.diplome;

    const generatedPdf = await pdfExport.generateMultiplePdf(formattedCampagnes, diplome, etablissementLabel, user);

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

const getXlsxMultipleExport = async (ids) => {
  try {
    const query = ids?.length ? { _id: { $in: ids.map((id) => ObjectId(id)) } } : {};

    const campagnes = await campagnesDao.getAll(query);

    const formattedCampagnes = campagnes.map((campagne) => ({
      campagneName: campagne.nomCampagne,
      formation: campagne.formation?.data.intitule_long,
      etablissementFormateurSiret: campagne.formation?.data.etablissement_formateur_siret,
      etablissementResponsableSiret: campagne.formation?.data.etablissement_gestionnaire_siret,
      etablissementFormateurLabel: campagne.formation?.data.etablissement_formateur_entreprise_raison_sociale,
      etablissementResponsableLabel: campagne.formation?.data.etablissement_gestionnaire_enseigne,
      seats: campagne.seats || "Illimité",
      temoignagesCount: campagne.temoignagesCount,
    }));

    const generatedXlsx = await xlsxExport.generateMultipleCampagnes(formattedCampagnes);

    const fileName = `campagnes Sirius.xlsx`;

    return {
      success: true,
      body: { data: generatedXlsx, fileName },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  getCampagnes,
  getOneCampagne,
  createCampagne,
  deleteCampagnes,
  updateCampagne,
  createMultiCampagne,
  getPdfExport,
  getPdfMultipleExport,
  getXlsxMultipleExport,
};
