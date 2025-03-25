import fs from "fs";

import type { CatalogueFormation } from "../catalogue.types";
import { DIPLOME_TYPE_MATCHER, OBSERVER_SCOPES } from "../constants";
import * as campagnesDao from "../dao/campagnes.dao";
import * as etablissementsDao from "../dao/etablissements.dao";
import * as formationsDao from "../dao/formations.dao";
import * as questionnairesDao from "../dao/questionnaires.dao";
import * as temoignagesDao from "../dao/temoignages.dao";
import type {
  GetAllWithTemoignageCountAndTemplateNameResults,
  GetOneWithTemoignagneCountAndTemplateNameResults,
} from "../dao/types/campagnes.types";
import * as verbatimsDao from "../dao/verbatims.dao";
import { QuestionnaireNotFoundError } from "../errors";
import * as catalogue from "../modules/catalogue";
import * as pdfExport from "../modules/pdfExport";
import * as xlsxExport from "../modules/xlsxExport";
import type { CampagneCreation, CampagneUpdate, ObserverScope, Opco } from "../types";
import { appendDataWhenEmpty, getStatistics, normalizeString } from "../utils/campagnes.utils";
import { getStaticFilePath } from "../utils/getStaticFilePath";

export const getCampagnes = async ({
  isObserver,
  scope,
  page = 1,
  pageSize = 10,
  query,
  search,
}: {
  isObserver: boolean;
  scope: ObserverScope | null;
  page: number;
  pageSize: number;
  query: { diplome?: string[]; siret?: string[]; departement?: string; campagneIds?: string[] };
  search: string;
}): Promise<
  | {
      success: true;
      body: GetAllWithTemoignageCountAndTemplateNameResults;
      ids: string[];
      pagination: {
        totalItems: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        hasMore: boolean;
      };
    }
  | { success: false; body: Error }
> => {
  try {
    let campagnes = [];

    if (isObserver) {
      // Nécessaire pour ne pas stocker la liste de code RNCP dans le scope d'un user et réconcilier les labels/valeurs
      if (scope?.field === OBSERVER_SCOPES.OPCO) {
        const SCOPE_LIST = getStaticFilePath("./opco.json");
        const opcos = JSON.parse(fs.readFileSync(SCOPE_LIST, "utf8"));
        const rncpCodes = opcos.find((opco: Opco) => opco.label === scope.value).value;

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
            campagne.nomCampagne?.toLowerCase().includes(normalizedSearch) ||
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
      delete campagne.temoignages;
      appendDataWhenEmpty(campagne);
    });

    return {
      success: true,
      body: paginatedCampagnes,
      ids: unpaginatedCampagnesIds,
      pagination: {
        totalItems: searchedCampagnes.length,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(searchedCampagnes.length / pageSize),
        hasMore: searchedCampagnes.length > page * pageSize,
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getOneCampagne = async (
  campagneId: string
): Promise<
  { success: true; body: GetOneWithTemoignagneCountAndTemplateNameResults } | { success: false; body: Error }
> => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneId);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteCampagnes = async (
  ids: string[]
): Promise<{ success: true; body: boolean } | { success: false; body: Error }> => {
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

export const updateCampagne = async (
  id: string,
  updatedCampagne: CampagneUpdate
): Promise<{ success: true; body: boolean } | { success: false; body: Error }> => {
  try {
    const campagne = await campagnesDao.update(id, updatedCampagne);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const createCampagnes = async (
  campagnes: (CampagneCreation & { etablissementFormateurSiret: string; formation: CatalogueFormation })[],
  currentUserId: string
): Promise<{ success: true; body: { createdCount: number } } | { success: false; body: Error }> => {
  try {
    const createdCampagneIds = [];

    for (const campagne of campagnes) {
      const { formation, etablissementFormateurSiret, ...rest } = campagne;

      let etablissementId;

      const etablissement = await etablissementsDao.findAll({ siret: etablissementFormateurSiret });
      etablissementId = etablissement[0]?.id;

      const foundFormation = await formationsDao.findAll({ catalogueId: formation._id });

      // La formation existe déjà et donc l'établissement aussi
      if (foundFormation?.length) {
        const createdCampagne = await campagnesDao.create(rest, foundFormation[0].id);
        createdCampagneIds.push(createdCampagne);

        // La formation n'existe pas
      } else {
        if (!etablissementId) {
          const foundEtablissement = await catalogue.getEtablissement(etablissementFormateurSiret);
          etablissementId = await etablissementsDao.create(
            {
              catalogueId: foundEtablissement._id,
              siret: foundEtablissement.siret,
              onisepNom: foundEtablissement.onisep_nom,
              onisepUrl: foundEtablissement.onisep_url,
              enseigne: foundEtablissement.enseigne,
              entrepriseRaisonSociale: foundEtablissement.entreprise_raison_sociale,
              uai: foundEtablissement.uai,
              localite: foundEtablissement.localite,
              regionImplantationNom: foundEtablissement.region_implantation_nom,
              catalogueData: JSON.stringify(foundEtablissement),
            },
            currentUserId
          );
        }
        const onisep_slug = campagne.formation.onisep_url?.match(/FOR\.\d+/) || null;

        const newFormation = {
          catalogueId: campagne.formation._id,
          catalogueData: JSON.stringify(campagne.formation),
          cfd: campagne.formation.cfd ? [campagne.formation.cfd] : null,
          codePostal: campagne.formation.code_postal,
          diplome: campagne.formation.diplome,
          duree: campagne.formation.duree,
          etablissementFormateurAdresse: campagne.formation.etablissement_formateur_adresse,
          etablissementFormateurEnseigne: campagne.formation.etablissement_formateur_enseigne,
          etablissementFormateurEntrepriseRaisonSociale:
            campagne.formation.etablissement_formateur_entreprise_raison_sociale,
          etablissementFormateurLocalite: campagne.formation.etablissement_formateur_localite,
          etablissementFormateurSiret: campagne.formation.etablissement_formateur_siret,
          etablissementGestionnaireEnseigne: campagne.formation.etablissement_gestionnaire_enseigne,
          etablissementGestionnaireSiret: campagne.formation.etablissement_gestionnaire_siret,
          etablissementId: etablissementId,
          intituleCourt: campagne.formation.intitule_court,
          intituleLong: campagne.formation.intitule_long,
          lieuFormationAdresse: campagne.formation.lieu_formation_adresse,
          lieuFormationAdresseComputed: campagne.formation.lieu_formation_adresse_computed,
          localite: campagne.formation.localite,
          numDepartement: campagne.formation.num_departement,
          onisepSlug: onisep_slug?.length ? onisep_slug[0] : null,
          region: campagne.formation.region,
          tags: JSON.stringify(campagne.formation?.tags || []),
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

export const getPdfMultipleExport = async (
  campagneIds: string[] = [],
  displayedUser: { label: string; email: string }
): Promise<{ success: true; body: { data: string; fileName: string } } | { success: false; body: Error }> => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCountFormationEtablissement(campagneIds);

    const formattedCampagnes = campagnes.map((campagne) => ({
      campagneId: campagne.id,
      campagneName: campagne.nomCampagne || campagne.formation.intituleLong || campagne.formation.intituleCourt,
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

    const diplome =
      DIPLOME_TYPE_MATCHER[campagnes[0].formation.diplome as keyof typeof DIPLOME_TYPE_MATCHER] ||
      campagnes[0].formation.diplome;

    const generatedPdf = await pdfExport.generateMultiplePdf(
      formattedCampagnes,
      diplome,
      etablissementLabel,
      displayedUser
    );

    const fileName = `campagnes Sirius.pdf`;

    return {
      success: true,
      body: { data: generatedPdf, fileName },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getXlsxMultipleExport = async (
  campagneIds: string[] = []
): Promise<{ success: true; body: { data: string; fileName: string } } | { success: false; body: Error }> => {
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
      cfd: campagne?.formation.cfd?.length ? campagne.formation.cfd.join(", ") : "",
      mef: campagne.formation?.bcnMefs10?.length ? campagne.formation.bcnMefs10[0]?.mef10 : "",
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

export const getCampagnesStatistics = async (
  campagneIds = []
): Promise<
  | {
      success: true;
      body: {
        campagnesCount: number;
        finishedCampagnesCount: number;
        temoignagesCount: number;
        champsLibreRate: string;
        medianDuration: string;
        verbatimsCount: number;
      };
    }
  | { success: false; body: Error }
> => {
  try {
    const query = { campagneIds };
    const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName({ query, allowEmptyFilter: true });

    const questionnaires = await questionnairesDao.findAll();

    if (!questionnaires?.length) {
      return { success: false, body: new QuestionnaireNotFoundError() };
    }

    const temoignages = campagnes
      .map((campagne) => campagne.temoignages)
      .flat()
      .filter((item) => item !== undefined);
    const temoignageIds = temoignages.map((temoignage) => temoignage?.id);

    let totalVerbatimCount = 0;
    if (temoignageIds?.length) {
      const verbatimsQuery = {
        temoignageIds: temoignageIds,
      };

      const verbatimsCountByStatus = await verbatimsDao.count(verbatimsQuery);

      totalVerbatimCount = verbatimsCountByStatus.reduce((acc, verbatim) => acc + verbatim.count, 0);
    }

    const statistics = getStatistics(campagnes, questionnaires, totalVerbatimCount);

    return { success: true, body: { ...statistics, verbatimsCount: totalVerbatimCount } };
  } catch (error) {
    return { success: false, body: error };
  }
};
