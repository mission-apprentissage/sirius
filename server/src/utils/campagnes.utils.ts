import type { GetAllWithTemoignageCountAndTemplateNameResults } from "../dao/types/campagnes.types";
import type { Formation, Questionnaire, RemoveArray } from "../types";
import { getChampsLibreField } from "./verbatims.utils";

const msToTime = (duration: number) => {
  let seconds: string | number = Math.floor((duration / 1000) % 60);
  let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
  let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours.toString();
  minutes = minutes < 10 ? "0" + minutes : minutes.toString();
  seconds = seconds < 10 ? "0" + seconds : seconds.toString();

  if (minutes === "00") return seconds + " sec";
  if (hours === "00") return minutes + " min " + seconds;
  return hours + " h " + minutes + " min " + seconds;
};

export const appendDataWhenEmpty = (campagne: { formation: Partial<Formation & { formationIds: string[] }> }) => {
  if (!campagne.formation.id) {
    campagne.formation = {
      id: "N/A",
      intituleLong: "N/A",
      tags: [],
      lieuFormationAdresseComputed: "N/A",
      lieuFormationAdresse: "N/A",
      codePostal: "N/A",
      diplome: "N/A",
      localite: "N/A",
      duree: 0,
      etablissementFormateurSiret: "N/A",
      etablissementGestionnaireSiret: "N/A",
      etablissementGestionnaireEnseigne: "N/A",
      etablissementFormateurEnseigne: "N/A",
      etablissementFormateurEntrepriseRaisonSociale: "N/A",
      formationIds: [],
    };
  }
};

const getFinishedCampagnes = (campagnes: GetAllWithTemoignageCountAndTemplateNameResults) => {
  return campagnes.filter((campagne) => new Date(campagne.endDate) < new Date());
};

const getTemoignagesCount = (campagnes: GetAllWithTemoignageCountAndTemplateNameResults) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.temoignagesCount, 0);
};

const getChampsLibreRate = (
  campagnes: GetAllWithTemoignageCountAndTemplateNameResults,
  questionnaires: Questionnaire[],
  verbatimsCount: number
) => {
  const filteredCampagnes = campagnes.filter((campagne) => campagne.temoignagesCount > 0);
  const filteredCampagnesWithPossibleChampsLibreCount = filteredCampagnes.map((campagne) => {
    const questionnaireUI = questionnaires.find(
      (questionnaire) => questionnaire.id === campagne.questionnaire.questionnaireId
    )?.questionnaireUi;

    return {
      ...campagne,
      possibleChampsLibreCount: getChampsLibreField(questionnaireUI, true).length,
    };
  });

  if (!filteredCampagnesWithPossibleChampsLibreCount.length) {
    return "N/A";
  }

  filteredCampagnesWithPossibleChampsLibreCount.forEach(
    (campagne) => (campagne.possibleChampsLibreCount = campagne.possibleChampsLibreCount * campagne.temoignagesCount)
  );

  const totalPossibleChampsLibreCount = filteredCampagnesWithPossibleChampsLibreCount.reduce(
    (acc, campagne) => acc + campagne.possibleChampsLibreCount,
    0
  );

  return Math.round((verbatimsCount * 100) / totalPossibleChampsLibreCount) + "%";
};

export const getMedianDuration = (campagnes: GetAllWithTemoignageCountAndTemplateNameResults) => {
  const filteredCampagnes = campagnes.filter((campagne) => campagne.temoignagesCount > 0);

  if (!filteredCampagnes.length) {
    return "N/A";
  }

  filteredCampagnes.forEach((campagne) => {
    if (!campagne.temoignages) return;
    (
      campagne as RemoveArray<GetAllWithTemoignageCountAndTemplateNameResults> & { medianDurationInMs: number }
    ).medianDurationInMs =
      campagne.temoignages.reduce(
        (acc, answer) =>
          answer?.lastQuestionAt
            ? acc + new Date(answer?.lastQuestionAt).getTime() - new Date(answer?.createdAt).getTime()
            : 0,
        0
      ) / campagne.temoignages.length;
  });

  const sum = filteredCampagnes.reduce(
    (acc, campagne) =>
      acc +
      (campagne as RemoveArray<GetAllWithTemoignageCountAndTemplateNameResults> & { medianDurationInMs: number })
        .medianDurationInMs,
    0
  );

  return msToTime(Math.round(sum / filteredCampagnes.length));
};

export const getStatistics = (
  campagnes: GetAllWithTemoignageCountAndTemplateNameResults,
  questionnaires: Questionnaire[],
  verbatimsCount: number
): {
  campagnesCount: number;
  finishedCampagnesCount: number;
  temoignagesCount: number;
  champsLibreRate: string;
  medianDuration: string;
} => ({
  campagnesCount: campagnes?.length || 0,
  finishedCampagnesCount: campagnes?.length ? getFinishedCampagnes(campagnes).length : 0,
  temoignagesCount: campagnes?.length ? getTemoignagesCount(campagnes) : 0,
  champsLibreRate: campagnes?.length ? getChampsLibreRate(campagnes, questionnaires, verbatimsCount) : "N/A",
  medianDuration: campagnes?.length ? getMedianDuration(campagnes) : "N/A",
});

export const normalizeString = (str: string) => {
  return str
    ? str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
    : "";
};
