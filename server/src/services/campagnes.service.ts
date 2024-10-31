// @ts-nocheck -- TODO

import fs from "fs";

import { DIPLOME_TYPE_MATCHER, OBSERVER_SCOPES } from "../constants";
import * as campagnesDao from "../dao/campagnes.dao";
import * as etablissementsDao from "../dao/etablissements.dao";
import * as formationsDao from "../dao/formations.dao";
import * as questionnairesDao from "../dao/questionnaires.dao";
import * as temoignagesDao from "../dao/temoignages.dao";
import * as verbatimsDao from "../dao/verbatims.dao";
import * as catalogue from "../modules/catalogue";
import * as pdfExport from "../modules/pdfExport";
import * as xlsxExport from "../modules/xlsxExport";
import { appendDataWhenEmpty, getMedianDuration, getStatistics, normalizeString } from "../utils/campagnes.utils";
import { getStaticFilePath } from "../utils/getStaticFilePath";
import { getChampsLibreField } from "../utils/verbatims.utils";

export const getCampagnes = async ({ isObserver, scope, page = 1, pageSize = 10, query, search }) => {
  try {
    let campagnes = [];

    if (isObserver) {
      // Nécessaire pour ne pas stocker la liste de code RNCP dans le scope d'un user et réconcilier les labels/valeurs
      if (scope?.field === OBSERVER_SCOPES.OPCO) {
        const SCOPE_LIST = getStaticFilePath("./opco.json");
        const opcos = JSON.parse(fs.readFileSync(SCOPE_LIST, "utf8"));
        const rncpCodes = opcos.find((opco) => opco.label === scope.value).value;

        scope.value = rncpCodes;
      }
      campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ scope, query });
    } else {
      campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ query, allowEmptyFilter: true });
    }

    const unpaginatedCampagnesIds = campagnes.map((campagne) => campagne.id);

    const searchedCampagnes = search
      ? campagnes.filter((campagne) => {
          const normalizedSearch = normalizeString(search).toLowerCase();
          return (
            campagne.nomCampagne.toLowerCase()?.includes(normalizedSearch) ||
            campagne.formation?.intituleLong?.toLowerCase().includes(normalizedSearch) ||
            campagne.formation?.localite?.toLowerCase().includes(normalizedSearch) ||
            campagne.formation?.lieuFormationAdresseComputed?.toLowerCase().includes(normalizedSearch) ||
            campagne.formation?.lieuFormationAdresse?.toLowerCase().includes(normalizedSearch) ||
            campagne.formation?.tags?.join("-").toLowerCase().includes(normalizedSearch)
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

export const getOneCampagne = async (campagneId) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneId);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteCampagnes = async (ids) => {
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

export const updateCampagne = async (id, updatedCampagne) => {
  try {
    const campagne = await campagnesDao.update(id, updatedCampagne);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const createCampagnes = async (campagnes, currentUserId) => {
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

export const getPdfExport = async (id) => {
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

export const getPdfMultipleExport = async (campagneIds = [], user) => {
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

export const getXlsxMultipleExport = async (campagneIds = []) => {
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
      onisepUrl: campagne.etablissement?.onisepUrl,
      rncpCode: campagne.formation?.rncpCode,
      certifInfo: campagne.formation?.idCertifinfo,
      cfd: campagne.formation?.cfd,
      mef: campagnes.formation?.bcnMefs10?.length ? campagnes.formation.bcnMefs10[0]?.mef10 : "",
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

export const getCampagnesStatistics = async (campagneIds = []) => {
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
