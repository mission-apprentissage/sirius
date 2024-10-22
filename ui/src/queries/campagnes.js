import { _post, _delete } from "../utils/httpClient";

export const fetchCampagnes = async ({
  search,
  diplome,
  siret,
  page = 1,
  pageSize = 10,
  token,
}) => {
  const url = "/api/campagnes";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      search,
      diplome,
      siret,
      page,
      pageSize,
    }),
  });

  if (!response.ok) {
    throw new Error("Erreur dans le chargement des campagnes");
  }

  const data = await response.json();
  if (data.body) {
    return data;
  }

  throw new Error("Erreur dans le chargement des campagnes");
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
  let url = `/api/campagnes/create`;

  const response = await _post(url, campagnes, token);

  if (response.createdCount) {
    return response;
  }
  throw new Error("Erreur dans la création des campagnes");
};
