import { _post, _get, _postFile } from "../utils/httpClient";

export const fetchTemoignagesDatavisualisation = async ({ campagneIds, token }) => {
  let url = `/api/temoignages/datavisualisation`;

  const response = await _post(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};

export const fetchDatavisualisationFormation = async ({ intituleFormation }) => {
  const url = `/api/temoignages/datavisualisation/formation?intituleFormation=${intituleFormation}`;

  const response = await _get(url);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};

export const fetchDatavisualisationEtablissement = async ({ uai }) => {
  const url = `/api/temoignages/datavisualisation/etablissement?uai=${uai}`;

  const response = await _get(url);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};

export const fetchUncompliantTemoignages = async ({
  token,
  type,
  duration,
  answeredQuestions,
  includeUnavailableDuration,
  page,
  pageSize,
}) => {
  let url = `/api/temoignages/uncompliant?type=${type}&duration=${duration}&includeUnavailableDuration=${includeUnavailableDuration}&answeredQuestions=${answeredQuestions}&page=${page}&pageSize=${pageSize}`;

  const response = await _get(url, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des témognages non conformes");
};

export const deleteTemoignages = async ({ temoignagesIds, token }) => {
  let url = `/api/temoignages/delete`;

  const response = await _post(url, temoignagesIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans la suppression des témoignages");
};

export const fetchTemoignagesXlsExport = async ({ campagneIds, token }) => {
  let url = `/api/temoignages/xls-export`;

  const response = await _postFile(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de l'export des témoignages");
};
