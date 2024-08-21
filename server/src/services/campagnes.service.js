const ObjectId = require("mongoose").mongo.ObjectId;
const campagnesDao = require("../dao/campagnes.dao");
const formationsDao = require("../dao/formations.dao");
const etablissementsDao = require("../dao/etablissements.dao");
const temoignagesDao = require("../dao/temoignages.dao");
const verbatimsDao = require("../dao/verbatims.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const { appendDataWhenEmpty, getStatistics, getMedianDuration } = require("../utils/campagnes.utils");
const pdfExport = require("../modules/pdfExport");
const {
  DIPLOME_TYPE_MATCHER,
  ETABLISSEMENT_NATURE,
  ETABLISSEMENT_RELATION_TYPE,
  CAMPAGNE_SORTING_TYPE,
} = require("../constants");
const referentiel = require("../modules/referentiel");
const xlsxExport = require("../modules/xlsxExport");
const catalogue = require("../modules/catalogue");
const { getChampsLibreField } = require("../utils/verbatims.utils");

const getCampagnes = async ({ isAdmin, isObserver, userSiret, scope, page = 1, pageSize = 10, query, search }) => {
  try {
    let campagnes = [];

    if (isAdmin) {
      campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ query });
    } else if (isObserver) {
      campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ scope, query });
    } else {
      const etablissementsFromReferentiel = await referentiel.getEtablissements(userSiret);

      let allSirets = [];
      for (const siret of userSiret) {
        const etablissement = etablissementsFromReferentiel.find((etablissement) => etablissement.siret === siret);
        if (!etablissement) continue;

        let relatedSirets = [siret];
        if (
          [ETABLISSEMENT_NATURE.GESTIONNAIRE, ETABLISSEMENT_NATURE.GESTIONNAIRE_FORMATEUR].includes(
            etablissement.nature
          )
        ) {
          relatedSirets.push(
            ...etablissement.relations
              .filter((relation) => relation.type === ETABLISSEMENT_RELATION_TYPE.RESPONSABLE_FORMATEUR)
              .map((etablissement) => etablissement.siret)
          );
        }
        allSirets.push(...relatedSirets);
      }

      campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ siret: allSirets, query });
    }

    const searchedCampagnes = search
      ? campagnes.filter((campagne) => {
          return (
            campagne.nomCampagne.toLowerCase()?.includes(search.toLowerCase()) ||
            campagne.formation?.data.intitule_long.toLowerCase()?.includes(search.toLowerCase()) ||
            campagne.formation?.data.localite.toLowerCase()?.includes(search.toLowerCase()) ||
            campagne.formation?.data.lieu_formation_adresse_computed?.toLowerCase().includes(search.toLowerCase()) ||
            campagne.formation?.data.lieu_formation_adresse?.toLowerCase().includes(search.toLowerCase()) ||
            campagne.formation?.data.tags?.join("-").toLowerCase().includes(search.toLowerCase())
          );
        })
      : campagnes;

    const paginatedCampagnes = searchedCampagnes.slice((page - 1) * pageSize, page * pageSize);

    paginatedCampagnes.map((campagne) => {
      delete campagne.questionnaireUI;
      delete campagne.questionnaire;
      delete campagne.temoignagesList;
      appendDataWhenEmpty(campagne);
    });

    return {
      success: true,
      body: paginatedCampagnes,
      pagination: {
        totalItems: searchedCampagnes.length,
        currentPage: parseInt(page),
        pageSize: pageSize,
        totalPages: Math.ceil(searchedCampagnes.length / pageSize),
        hasMore: searchedCampagnes.length > page * pageSize,
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getSortedCampagnes = async (isAdmin, isObserver, userSiret, sortingType, scope) => {
  try {
    let campagnes = [];
    const etablissementsFromReferentiel = await referentiel.getEtablissements(userSiret);

    if (isAdmin) {
      campagnes = await campagnesDao.getAllOnlyDiplomeTypeAndEtablissements();
    } else if (isObserver) {
      campagnes = scope ? await campagnesDao.getAllOnlyDiplomeTypeAndEtablissements(null, scope) : [];
    } else {
      let allSirets = [];
      for (const siret of userSiret) {
        const etablissement = etablissementsFromReferentiel.find((etablissement) => etablissement.siret === siret);
        if (!etablissement) continue;

        let relatedSirets = [siret];
        if (
          [ETABLISSEMENT_NATURE.GESTIONNAIRE, ETABLISSEMENT_NATURE.GESTIONNAIRE_FORMATEUR].includes(
            etablissement.nature
          )
        ) {
          relatedSirets.push(
            ...etablissement.relations
              .filter((relation) => relation.type === ETABLISSEMENT_RELATION_TYPE.RESPONSABLE_FORMATEUR)
              .map((etablissement) => etablissement.siret)
          );
        }
        allSirets.push(...relatedSirets);
      }

      campagnes = await campagnesDao.getAllOnlyDiplomeTypeAndEtablissements({ siret: allSirets });
    }
    let results = [];

    if (sortingType === CAMPAGNE_SORTING_TYPE.DIPLOME_TYPE) {
      const campagnesGroupedByDiplome = campagnes.reduce((acc, campagne) => {
        appendDataWhenEmpty(campagne);
        const diplome = campagne.formation?.data.diplome;
        if (!acc[diplome]) {
          acc[diplome] = [];
        }
        acc[diplome].push(campagne);
        return acc;
      }, {});

      const formattedResults = Object.keys(campagnesGroupedByDiplome).map((key) => {
        const campagneIds = campagnesGroupedByDiplome[key].map((campagne) => campagne._id);
        return {
          diplome: key,
          campagneIds: campagneIds,
        };
      });

      results = formattedResults;
    } else if (sortingType === CAMPAGNE_SORTING_TYPE.ETABLISSEMENT) {
      const campagnesGroupedByEtablissement = campagnes.reduce((acc, campagne) => {
        appendDataWhenEmpty(campagne);
        const siret = campagne.formation.data.etablissement_formateur_siret;
        if (!acc[siret]) {
          acc[siret] = [];
        }
        acc[siret].push(campagne);
        return acc;
      }, {});

      const formattedResults = Object.keys(campagnesGroupedByEtablissement).map((key) => {
        const campagneIds = campagnesGroupedByEtablissement[key].map((campagne) => campagne._id);
        return {
          etablissementFormateur: campagnesGroupedByEtablissement[key][0].formation.data,
          campagneIds: campagneIds,
        };
      });

      results = formattedResults;
    } else if (sortingType === CAMPAGNE_SORTING_TYPE.DEPARTEMENT) {
      const campagnesGroupedByDepartement = campagnes.reduce((acc, campagne) => {
        appendDataWhenEmpty(campagne);
        const departement = campagne.formation.data.num_departement;
        if (!acc[departement]) {
          acc[departement] = [];
        }
        acc[departement].push(campagne);
        return acc;
      }, {});

      const formattedResults = Object.keys(campagnesGroupedByDepartement).map((key) => {
        const campagneIds = campagnesGroupedByDepartement[key].map((campagne) => campagne._id);
        return {
          departement: key,
          campagneIds: campagneIds,
        };
      });

      results = formattedResults;
    } else if (sortingType === CAMPAGNE_SORTING_TYPE.ALL) {
      const formattedResults = {
        campagneIds: campagnes.map((campagne) => campagne._id),
      };

      results = [formattedResults];
    }

    return {
      success: true,
      body: results,
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getOneCampagne = async (campagneId) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneId);
    return { success: true, body: campagne };
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
        const etablissement = await catalogue.getEtablissement(etablissementFormateurSiret);
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

    const formation = await formationsDao.findAll({ campagne_id: id });

    const campagneName = campagne.nomCampagne || formation[0].data.intitule_long || formation[0].data.intitule_court;

    const generatedPdf = await pdfExport.generatePdf(campagne._id, campagneName);

    return { success: true, body: { data: generatedPdf, fileName: campagneName + ".pdf" } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getPdfMultipleExport = async (campagneIds = [], user) => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement(campagneIds);

    const formattedCampagnes = campagnes.map((campagne) => ({
      campagneId: campagne._id.toString(),
      campagneName:
        campagne.nomCampagne || campagne.formation.data.intitule_long || campagne.formation.data.intitule_court,
      localite: campagne.formation.data.localite,
      adresse: campagne.formation.data.lieu_formation_adresse_computed,
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

    const fileName = `campagnes Sirius.pdf`;

    return {
      success: true,
      body: { data: generatedPdf, fileName },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getXlsxMultipleExport = async (campagneIds = []) => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement(campagneIds);

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

const getCampagnesStatistics = async (campagneIds) => {
  try {
    const query = { campagneIds: { $in: campagneIds.map((id) => ObjectId(id)) } };
    const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ query });

    const onlyQpenQuestionKeyList = [];
    const questionnaires = await questionnairesDao.findAll();
    questionnaires.forEach((questionnaire) => [
      onlyQpenQuestionKeyList.push(getChampsLibreField(questionnaire.questionnaireUI, true)),
    ]);
    const uniqueChampsLibreFields = [...new Set(onlyQpenQuestionKeyList.flat())];

    const temoignagesList = campagnes.map((campagne) => campagne.temoignagesList).flat();
    const temoignageIds = temoignagesList.map((temoignagne) => temoignagne.id);
    const verbatimsQuery = {
      temoignageIds: temoignageIds,
      questionKey: uniqueChampsLibreFields,
    };
    const verbatimsCountByStatus = await verbatimsDao.count(verbatimsQuery);

    const totalVerbatimCount = verbatimsCountByStatus.reduce((acc, verbatim) => acc + verbatim.count, 0);

    campagnes.forEach((campagne) => {
      campagne.possibleChampsLibreCount = getChampsLibreField(campagne.questionnaireUI, true).length;
      campagne.medianDurationInMs = getMedianDuration(campagne.temoignagesList);
    });

    const statistics = getStatistics(campagnes, totalVerbatimCount);

    return { success: true, body: { ...statistics, verbatimsCount: totalVerbatimCount } };
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
  getSortedCampagnes,
  getCampagnesStatistics,
};
