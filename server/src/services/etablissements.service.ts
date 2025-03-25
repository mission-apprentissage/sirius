import { ETABLISSEMENT_RELATION_TYPE } from "../constants";
import * as campagnesDao from "../dao/campagnes.dao";
import * as etablissementsDao from "../dao/etablissements.dao";
import * as questionnairesDao from "../dao/questionnaires.dao";
import * as temoignagesDao from "../dao/temoignages.dao";
import type {
  FindAllEtablissementWithCountsResults,
  FindAllWithTemoignageCountResults,
} from "../dao/types/etablissements.types";
import * as verbatimsDao from "../dao/verbatims.dao";
import * as catalogue from "../modules/catalogue";
import * as referentiel from "../modules/referentiel";
import type { Etablissement } from "../types";
import { getChampsLibreField } from "../utils/verbatims.utils";

export const createEtablissements = async (
  etablissementsArray: { id: string; siret: string; userId: string }[],
  relatedUserId: string
): Promise<{ success: true; body: string[] } | { success: false; body: Error }> => {
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
        if (createdEtablissement) {
          createdEtablissements.push(createdEtablissement);
        }
      } else {
        const createdRelation = await etablissementsDao.createUserRelation(existingEtablissement[0].id, relatedUserId);
        if (createdRelation) {
          createdEtablissements.push(createdRelation.id);
        }
      }
    }

    return { success: true, body: createdEtablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getEtablissements = async ({
  search,
}: {
  search: string;
}): Promise<{ success: true; body: Omit<Etablissement, "catalogueData">[] } | { success: false; body: Error }> => {
  try {
    const query = search ? { searchText: search } : {};
    const etablissements = await etablissementsDao.findAll(query);

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getEtablissementsWithTemoignageCount = async (): Promise<
  | {
      success: true;
      body: FindAllWithTemoignageCountResults &
        { onisep_url: string | null; onisep_nom: string | null; entreprise_raison_sociale: string | null }[];
    }
  | { success: false; body: Error }
> => {
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

export const getEtablissementsSuivi = async (): Promise<
  | {
      success: true;
      body: FindAllEtablissementWithCountsResults;
    }
  | { success: false; body: Error }
> => {
  try {
    const etablissements = await etablissementsDao.findAllEtablissementWithCounts();

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getEtablissementsPublicStatistics = async (): Promise<
  | {
      success: true;
      body: {
        etablissementsCount: number;
        createdCampagnesCount: number;
        temoignagesCount: number;
        verbatimsCount: number;
      };
    }
  | { success: false; body: Error }
> => {
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
