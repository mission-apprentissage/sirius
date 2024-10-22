const campagnesDao = require("../dao/campagnes.dao");
const formationsDao = require("../dao/formations.dao");
const etablissementsDao = require("../dao/etablissements.dao");
const temoignagesDao = require("../dao/temoignages.dao");
const verbatimsDao = require("../dao/verbatims.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const { appendDataWhenEmpty, getStatistics, getMedianDuration } = require("../utils/campagnes.utils");
const pdfExport = require("../modules/pdfExport");
const { DIPLOME_TYPE_MATCHER, ETABLISSEMENT_NATURE, ETABLISSEMENT_RELATION_TYPE } = require("../constants");
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

    const unpaginatedCampagnesIds = campagnes.map((campagne) => campagne.id);

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
      ids: unpaginatedCampagnesIds,
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

const getOneCampagne = async (campagneId) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneId);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteCampagnes = async (ids) => {
  try {
    const deletedCampagnes = await campagnesDao.deleteMany(ids);
    const deletedVerbatims = await verbatimsDao.deleteManyByCampagneIds(ids);
    const deletedTemoignages = await temoignagesDao.deleteManyByCampagneId(ids);

    return {
      success: true,
      body: deletedCampagnes && deletedTemoignages && deletedVerbatims,
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

const createCampagnes = async (campagnes, currentUserId) => {
  try {
    const createdCampagneIds = [];

    for (const campagne of campagnes) {
      const { formation, etablissementFormateurSiret, ...rest } = campagne;

      let etablissement;

      etablissement = await etablissementsDao.findAll({ siret: etablissementFormateurSiret });

      const foundFormation = await formationsDao.findAll({ catalogueId: formation._id });

      // La formation existe déjà et donc l'établissement aussi
      if (foundFormation.length) {
        const createdCampagne = await campagnesDao.create(rest, foundFormation[0].id);
        createdCampagneIds.push(createdCampagne);

        // La formation n'existe pas
      } else {
        if (!etablissement.length) {
          const foundEtablissement = await catalogue.getEtablissement(etablissementFormateurSiret);
          etablissement = await etablissementsDao.create(
            {
              catalogue_id: foundEtablissement._id,
              siret: foundEtablissement.siret,
              onisep_nom: foundEtablissement.onisep_nom,
              onisep_url: foundEtablissement.onisep_url,
              enseigne: foundEtablissement.enseigne,
              entreprise_raison_sociale: foundEtablissement.entreprise_raison_sociale,
              uai: foundEtablissement.uai,
              localite: foundEtablissement.localite,
              region_implantation_nom: foundEtablissement.region_implantation_nom,
              catalogue_data: JSON.stringify(foundEtablissement),
            },
            currentUserId
          );
        }
        const newFormation = {
          catalogue_id: campagne.formation._id,
          region: campagne.formation.region,
          num_departement: campagne.formation.num_departement,
          intitule_long: campagne.formation.intitule_long,
          intitule_court: campagne.formation.intitule_court,
          diplome: campagne.formation.diplome,
          localite: campagne.formation.localite,
          tags: JSON.stringify(campagne.formation?.tags || []),
          lieu_formation_adresse: campagne.formation.lieu_formation_adresse,
          lieu_formation_adresse_computed: campagne.formation.lieu_formation_adresse_computed,
          code_postal: campagne.formation.code_postal,
          duree: campagne.formation.duree,
          etablissement_gestionnaire_siret: campagne.formation.etablissement_gestionnaire_siret,
          etablissement_gestionnaire_enseigne: campagne.formation.etablissement_gestionnaire_enseigne,
          etablissement_formateur_siret: campagne.formation.etablissement_formateur_siret,
          etablissement_formateur_enseigne: campagne.formation.etablissement_formateur_enseigne,
          etablissement_formateur_entreprise_raison_sociale:
            campagne.formation.etablissement_formateur_entreprise_raison_sociale,
          etablissement_formateur_adresse: campagne.formation.etablissement_formateur_adresse,
          etablissement_formateur_localite: campagne.formation.etablissement_formateur_localite,
          catalogue_data: JSON.stringify(campagne.formation),
          etablissement_id: etablissement.id,
        };

        const createdCampagne = await campagnesDao.createWithFormation(rest, newFormation);

        createdCampagneIds.push(createdCampagne);
      }
    }

    return { success: true, body: { createdCount: createdCampagneIds.length } };
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

    const formattedCampagnes = campagnes.map((campagne) => ({
      campagneName: campagne.nomCampagne,
      formation: campagne.formation?.intituleLong,
      etablissementFormateurSiret: campagne.formation?.etablissementFormateurSiret,
      etablissementResponsableSiret: campagne.formation?.etablissementGestionnaireSiret,
      etablissementFormateurLabel: campagne.formation?.etablissementFormateurEntrepriseRaisonSociale,
      etablissementResponsableLabel: campagne.formation?.etablissementGestionnaireEnseigne,
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

const getCampagnesStatistics = async (campagneIds = []) => {
  try {
    const query = { campagneIds };
    const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ query, allowEmptyFilter: true });

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
  deleteCampagnes,
  updateCampagne,
  createCampagnes,
  getPdfExport,
  getPdfMultipleExport,
  getXlsxMultipleExport,
  getCampagnesStatistics,
};
