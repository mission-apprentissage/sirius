const etablissementsDao = require("../dao/etablissements.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const campagnesDao = require("../dao/campagnes.dao");
const temoignagesDao = require("../dao/temoignages.dao");
const verbatimsDao = require("../dao/verbatims.dao");
const { getChampsLibreField } = require("../utils/verbatims.utils");
const catalogue = require("../modules/catalogue");
const referentiel = require("../modules/referentiel");
const { ETABLISSEMENT_RELATION_TYPE } = require("../constants");

const createEtablissements = async (etablissementsArray, relatedUserId) => {
  try {
    let createdEtablissements = [];

    for (const etablissement of etablissementsArray) {
      const existingEtablissementQuery = {
        "siret": etablissement.siret,
      };
      const existingEtablissement = await etablissementsDao.findAll(existingEtablissementQuery);
      if (!existingEtablissement.length) {
        const etablissementFromCatalogue = await catalogue.getEtablissement(etablissement.siret);
        const formattedEtablissement = {
          catalogue_id: etablissementFromCatalogue._id,
          siret: etablissementFromCatalogue.siret,
          onisep_nom: etablissementFromCatalogue.onisep_nom,
          onisep_url: etablissementFromCatalogue.onisep_url,
          enseigne: etablissementFromCatalogue.enseigne,
          entreprise_raison_sociale: etablissementFromCatalogue.entreprise_raison_sociale,
          uai: etablissementFromCatalogue.uai,
          localite: etablissementFromCatalogue.localite,
          region_implantation_nom: etablissementFromCatalogue.region_implantation_nom,
          catalogue_data: JSON.stringify(etablissementFromCatalogue),
        };
        const createdEtablissement = await etablissementsDao.create(formattedEtablissement, relatedUserId);
        createdEtablissements.push(createdEtablissement);
      } else {
        const createdRelation = await etablissementsDao.createUserRelation(existingEtablissement[0].id, relatedUserId);
        createdEtablissements.push(createdRelation);
      }
    }

    return { success: true, body: createdEtablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissements = async ({ search }) => {
  try {
    const query = search ? { searchText: search } : {};
    const etablissements = await etablissementsDao.findAll(query);

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissementsWithTemoignageCount = async () => {
  try {
    const etablissement = await etablissementsDao.findAllWithTemoignageCount();
    const reformatForExtension = etablissement.map((etablissement) => ({
      ...etablissement,
      onisep_url: etablissement.onisepUrl,
      onisep_nom: etablissement.onisepNom,
      entreprise_raison_sociale: etablissement.entrepriseRaisonSociale,
    }));
    return { success: true, body: reformatForExtension };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.findOne(id);
    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.deleteOne(id);
    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateEtablissement = async (id, updatedEtablissement) => {
  try {
    const etablissement = await etablissementsDao.update(id, updatedEtablissement);

    if (!etablissement) throw new Error("Etablissement not found");

    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissementsSuivi = async () => {
  try {
    const etablissements = await etablissementsDao.findAllEtablissementWithCounts();

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissementsPublicStatistics = async () => {
  try {
    const allEtablissements = await etablissementsDao.findAll({});
    const allEtablissementCount = allEtablissements.length;

    const etablissementsSiret = allEtablissements.map((etablissement) => etablissement.siret);
    const etablissementsFromReferentiel = await referentiel.getEtablissements(etablissementsSiret);
    const etablissementsRelationsCount = etablissementsFromReferentiel
      .map((etablissement) => {
        if (etablissement?.relations?.length) {
          return etablissement.relations;
        }
      })
      .filter(Boolean)
      .flat()
      .filter((relation) => relation.type === ETABLISSEMENT_RELATION_TYPE.RESPONSABLE_FORMATEUR)
      .filter((relation) => !etablissementsSiret.includes(relation.siret)).length;

    const createdCampagnesCount = await campagnesDao.countWithAtLeastOneTemoignages();
    const temoignagesCount = await temoignagesDao.count();

    const onlyQpenQuestionKeyList = [];
    const questionnaires = await questionnairesDao.findAll();
    questionnaires.forEach((questionnaire) => [
      onlyQpenQuestionKeyList.push(getChampsLibreField(questionnaire.questionnaireUI, true)),
    ]);

    const verbatimsCountByStatus = await verbatimsDao.count();
    const totalVerbatimCount = verbatimsCountByStatus.reduce((acc, verbatim) => acc + verbatim.count, 0);

    return {
      success: true,
      body: {
        etablissementsCount: allEtablissementCount + etablissementsRelationsCount,
        createdCampagnesCount,
        temoignagesCount,
        verbatimsCount: totalVerbatimCount,
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  createEtablissements,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
  getEtablissementsSuivi,
  getEtablissementsPublicStatistics,
  getEtablissementsWithTemoignageCount,
};
