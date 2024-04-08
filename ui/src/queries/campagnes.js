import { _get, _post } from "../utils/httpClient";

export const fetchCampagnes = async ({ query = null, page = 1, pageSize = 10, token }) => {
  let url = `/api/campagnes?page=${page}&pageSize=${pageSize}`;

  if (query) {
    url += `&${query}`;
  }

  const response = await _get(url, token);
  if (response.body) {
    return response;
  }
  throw new Error("Erreur dans le chargement des campagnes");
};

export const fetchCampagnesSorted = async ({ type = null, token }) => {
  let url = `/api/campagnes/sorted?type=${type}`;

  const response = await _get(url, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des campagnes triées");
};

export const fetchQuestionnaire = async ({ id }) => {
  let url = `/api/questionnaires/${id}`;

  const response = await _get(url);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement du questionnaire");
};

export const fetchCampagnesDatavisualisation = async ({ campagneIds, token }) => {
  let url = `/api/temoignages/datavisualisation`;

  const response = await _post(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};

export const fetchCampagnesStatistics = async ({ campagneIds, token }) => {
  let url = `/api/campagnes/statistics`;

  const response = await _post(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des statistiques des campagnes");
};
