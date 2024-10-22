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
            campagne.formation?.intituleLong?.toLowerCase().includes(search.toLowerCase()) ||
            campagne.formation?.localite?.toLowerCase().includes(search.toLowerCase()) ||
            campagne.formation?.lieuFormationAdresseComputed?.toLowerCase().includes(search.toLowerCase()) ||
            campagne.formation?.lieuFormationAdresse?.toLowerCase().includes(search.toLowerCase()) ||
            campagne.formation?.tags?.join("-").toLowerCase().includes(search.toLowerCase())
          );
        })
      : campagnes;

    const paginatedCampagnes = searchedCampagnes.slice((page - 1) * pageSize, page * pageSize);

    paginatedCampagnes.map((campagne) => {
      delete campagne.questionnaireUI;
      delete campagne.questionnaire;
      delete campagne.temoignages;
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

const getSortedCampagnes = async (isAdmin, isObserver, userSiret = [], sortingType, scope) => {
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
        const diplome = campagne.formation?.diplome;
        if (!acc[diplome]) {
          acc[diplome] = [];
        }
        acc[diplome].push(campagne);
        return acc;
      }, {});

      const formattedResults = Object.keys(campagnesGroupedByDiplome).map((key) => {
        const campagneIds = campagnesGroupedByDiplome[key].map((campagne) => campagne.id);
        return {
          diplome: key,
          campagneIds: campagneIds,
        };
      });

      results = formattedResults;
    } else if (sortingType === CAMPAGNE_SORTING_TYPE.ETABLISSEMENT) {
      const campagnesGroupedByEtablissement = campagnes.reduce((acc, campagne) => {
        appendDataWhenEmpty(campagne);
        const siret = campagne.formation.etablissementFormateurSiret;
        if (!acc[siret]) {
          acc[siret] = [];
        }
        acc[siret].push(campagne);
        return acc;
      }, {});

      const formattedResults = Object.keys(campagnesGroupedByEtablissement).map((key) => {
        const campagneIds = campagnesGroupedByEtablissement[key].map((campagne) => campagne.id);
        return {
          etablissementFormateur: campagnesGroupedByEtablissement[key][0].formation,
          campagneIds: campagneIds,
        };
      });

      results = formattedResults;
    } else if (sortingType === CAMPAGNE_SORTING_TYPE.DEPARTEMENT) {
      const campagnesGroupedByDepartement = campagnes.reduce((acc, campagne) => {
        appendDataWhenEmpty(campagne);
        const departement = campagne.formation.numDepartement;
        if (!acc[departement]) {
          acc[departement] = [];
        }
        acc[departement].push(campagne);
        return acc;
      }, {});

      const formattedResults = Object.keys(campagnesGroupedByDepartement).map((key) => {
        const campagneIds = campagnesGroupedByDepartement[key].map((campagne) => campagne.id);
        return {
          departement: key,
          campagneIds: campagneIds,
        };
      });

      results = formattedResults;
    } else if (sortingType === CAMPAGNE_SORTING_TYPE.ALL) {
      const formattedResults = {
        campagneIds: campagnes.map((campagne) => campagne.id),
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
    const deletedTemoignages = await temoignagesDao.deleteManyByCampagneId(ids);
    const deletedFormationsIds = await formationsDao.deleteManyByCampagneIdAndReturnsTheDeletedFormationId(ids);

    return {
      success: true,
      body: deletedCampagnes && deletedTemoignages && deletedFormationsIds.length === ids.length,
    };
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

const createMultiCampagne = async (campagnes, currentUserId) => {
  try {
    const formationsIds = [];

    for (const campagne of campagnes) {
      const { formation, etablissementFormateurSiret, ...rest } = campagne;

      const etablissement = await etablissementsDao.findAll({ siret: etablissementFormateurSiret });

      const createdCampagne = await campagnesDao.create(rest);

      const createdFormation = await formationsDao.create({
        catalogue_id: formation._id,
        region: formation.region,
        num_departement: formation.num_departement,
        intitule_long: formation.intitule_long,
        intitule_court: formation.intitule_court,
        diplome: formation.diplome,
        localite: formation.localite,
        tags: JSON.stringify(formation.tags),
        lieu_formation_adresse: formation.lieu_formation_adresse,
        lieu_formation_adresse_computed: formation.lieu_formation_adresse_computed,
        code_postal: formation.code_postal,
        duree: formation.duree,
        etablissement_gestionnaire_siret: formation.etablissement_gestionnaire_siret,
        etablissement_gestionnaire_enseigne: formation.etablissement_gestionnaire_enseigne,
        etablissement_formateur_siret: formation.etablissement_formateur_siret,
        etablissement_formateur_enseigne: formation.etablissement_formateur_enseigne,
        etablissement_formateur_entreprise_raison_sociale: formation.etablissement_formateur_entreprise_raison_sociale,
        etablissement_formateur_adresse: formation.etablissement_formateur_adresse,
        etablissement_formateur_localite: formation.etablissement_formateur_localite,
        catalogue_data: JSON.stringify(formation),
        etablissement_id: etablissement.id,
        campagneId: createdCampagne.id,
      });

      formationsIds.push(createdFormation.id);

      if (!etablissement.length) {
        const etablissement = await catalogue.getEtablissement(etablissementFormateurSiret);
        await etablissementsDao.create(
          {
            catalogue_id: etablissement._id,
            siret: etablissement.siret,
            onisep_nom: etablissement.onisep_nom,
            onisep_url: etablissement.onisep_url,
            enseigne: etablissement.enseigne,
            entreprise_raison_sociale: etablissement.entreprise_raison_sociale,
            uai: etablissement.uai,
            localite: etablissement.localite,
            region_implantation_nom: etablissement.region_implantation_nom,
            catalogue_data: JSON.stringify(etablissement),
          },
          currentUserId
        );
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

    const formation = await formationsDao.findAll({ campagneid: id });

    const campagneName = campagne.nomCampagne || formation[0].intituleLong || formation[0].intitule_court;

    const generatedPdf = await pdfExport.generatePdf(campagne.id, campagneName);

    return { success: true, body: { data: generatedPdf, fileName: campagneName + ".pdf" } };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getPdfMultipleExport = async (campagneIds = [], user) => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement(campagneIds);

    const formattedCampagnes = campagnes.map((campagne) => ({
      campagneId: campagne.id,
      campagneName: campagne.nomCampagne || campagne.formation.intituleLong || campagne.formation.intitule_court,
      localite: campagne.formation.localite,
      adresse: campagne.formation.lieuFormationAdresseComputed,
      tags: campagne.formation.tags,
      duree: campagne.formation.duree,
    }));

    const etablissementLabel =
      campagnes[0].etablissement.onisepNom ||
      campagnes[0].etablissement.enseigne ||
      campagnes[0].etablissement.entrepriseRaisonSociale ||
      "";

    const diplome = DIPLOME_TYPE_MATCHER[campagnes[0].formation.diplome] || campagnes[0].formation.diplome;

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
    const formattedCampagnes = campagnes.map((campagne) => {
      let mef = "";
      const bcnMefs10 = campagne.formation?.bcnMefs10;
      if (bcnMefs10) {
        const parsedMefs = JSON.parse(bcnMefs10);
        mef = Array.isArray(parsedMefs) && parsedMefs.length ? parsedMefs[0]?.mef10 || "" : "";
      }

      return {
        campagneName: campagne.nomCampagne,
        formation: campagne.formation?.intituleLong,
        etablissementFormateurSiret: campagne.formation?.etablissementFormateurSiret,
        etablissementResponsableSiret: campagne.formation?.etablissementGestionnaireSiret,
        etablissementFormateurLabel: campagne.formation?.etablissementFormateurEntrepriseRaisonSociale,
        etablissementResponsableLabel: campagne.formation?.etablissementGestionnaireEnseigne,
        seats: campagne.seats || "Illimité",
        temoignagesCount: campagne.temoignagesCount,
        onisepUrl: campagne.etablissement?.onisepUrl,
        rncpCode: campagne.formation?.rncpCode,
        certifInfo: campagne.formation?.idCertifinfo,
        cfd: campagne.formation?.cfd,
        mef: mef,
      };
    });

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

const getCampagnesStatistics = async (campagneIds = []) => {
  try {
    const query = { campagneIds };
    const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ query });

    const questionnaires = await questionnairesDao.findAll();
    const temoignages = campagnes.map((campagne) => campagne.temoignages).flat();
    const temoignageIds = temoignages.map((temoignagne) => temoignagne.id);

    campagnes.forEach((campagne) => {
      const questionnaireUI = questionnaires.find(
        (questionnaire) => questionnaire.id === campagne.questionnaireId
      ).questionnaireUi;
      campagne.possibleChampsLibreCount = getChampsLibreField(questionnaireUI, true).length;
      campagne.medianDurationInMs = getMedianDuration(campagne.temoignages);
    });

    let totalVerbatimCount = 0;
    if (temoignageIds.length) {
      const verbatimsQuery = {
        temoignageIds: temoignageIds,
      };

      const verbatimsCountByStatus = await verbatimsDao.count(verbatimsQuery);

      totalVerbatimCount = verbatimsCountByStatus.reduce((acc, verbatim) => acc + verbatim.count, 0);
    }

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
