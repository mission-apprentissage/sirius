import { _get, _post, _delete } from "../utils/httpClient";

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

export const fetchCampagnesStatistics = async ({ campagneIds, token }) => {
  let url = `/api/campagnes/statistics`;

  const response = await _post(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des statistiques des campagnes");
};

export const deleteCampagnes = async ({ campagneIds, siret, token }) => {
  let url = `/api/campagnes?ids=${campagneIds}&siret=${siret}`;

  const response = await _delete(url, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans la suppression des campagnes");
};

export const createCampagnes = async ({ campagnes, token }) => {
  let url = `/api/campagnes`;

  const response = await _post(url, campagnes, token);

  if (response.createdCount) {
    return response;
  }
  throw new Error("Erreur dans la création des campagnes");
};
