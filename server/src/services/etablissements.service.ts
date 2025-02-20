import { ETABLISSEMENT_RELATION_TYPE } from "../constants";
import * as campagnesDao from "../dao/campagnes.dao";
import * as etablissementsDao from "../dao/etablissements.dao";
import * as questionnairesDao from "../dao/questionnaires.dao";
import * as temoignagesDao from "../dao/temoignages.dao";
import * as verbatimsDao from "../dao/verbatims.dao";
import * as catalogue from "../modules/catalogue";
import * as referentiel from "../modules/referentiel";
import { getChampsLibreField } from "../utils/verbatims.utils";

export const createEtablissements = async (
  etablissementsArray: { id: string; siret: string; userId: string }[],
  relatedUserId: string
) => {
  try {
    const createdEtablissements = [];

    for (const etablissement of etablissementsArray) {
      const existingEtablissementQuery = {
        siret: etablissement.siret,
      };
      const existingEtablissement = await etablissementsDao.findAll(existingEtablissementQuery);
      if (!existingEtablissement.length) {
        const etablissementFromCatalogue = await catalogue.getEtablissement(etablissement.siret);
        const formattedEtablissement = {
          catalogueId: etablissementFromCatalogue._id,
          siret: etablissementFromCatalogue.siret,
          onisepNom: etablissementFromCatalogue.onisep_nom,
          onisepUrl: etablissementFromCatalogue.onisep_url,
          enseigne: etablissementFromCatalogue.enseigne,
          entrepriseRaisonSociale: etablissementFromCatalogue.entreprise_raison_sociale,
          uai: etablissementFromCatalogue.uai,
          localite: etablissementFromCatalogue.localite,
          regionImplantationNom: etablissementFromCatalogue.region_implantation_nom,
          catalogueData: JSON.stringify(etablissementFromCatalogue),
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

export const getEtablissements = async ({ search }: { search: string }) => {
  try {
    const query = search ? { searchText: search } : {};
    const etablissements = await etablissementsDao.findAll(query);

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getEtablissementsWithTemoignageCount = async () => {
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

export const getEtablissementsSuivi = async () => {
  try {
    const etablissements = await etablissementsDao.findAllEtablissementWithCounts();

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getEtablissementsPublicStatistics = async () => {
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
        return null;
      })
      .filter(Boolean)
      .flat()
      .filter((relation) => relation?.type === ETABLISSEMENT_RELATION_TYPE.RESPONSABLE_FORMATEUR)
      .filter((relation) => relation && !etablissementsSiret.includes(relation.siret)).length;

    const createdCampagnesCount = await campagnesDao.countWithAtLeastOneTemoignages();
    const temoignagesCount = await temoignagesDao.count();

    const onlyQpenQuestionKeyList = [];
    const questionnaires = await questionnairesDao.findAll();
    questionnaires?.forEach((questionnaire) => [
      onlyQpenQuestionKeyList.push(getChampsLibreField(questionnaire.questionnaireUi, true)),
    ]);

    const verbatimsCountByStatus = await verbatimsDao.count({});
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
