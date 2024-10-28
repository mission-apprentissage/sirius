import { apiDelete, apiGet, apiPost } from "../utils/api.utils";

export const fetchCampagnes = async ({ search, diplome, siret, page = 1, pageSize = 10, token }) => {
  const response = await apiPost("/api/campagnes", {
    body: { page, pageSize, search, diplome, siret },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }

  throw new Error("Erreur dans le chargement des campagnes");
};

export const fetchCampagnesStatistics = async ({ campagneIds, token }) => {
  const response = await apiPost("/api/campagnes/statistics", {
    body: campagneIds,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des statistiques des campagnes");
};

export const deleteCampagnes = async ({ campagneIds, siret, token }) => {
  const response = await apiDelete(`/api/campagne`, {
    querystring: { ids: campagneIds, siret },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response) {
    return response;
  }
  throw new Error("Erreur dans la suppression des campagnes");
};

export const createCampagnes = async ({ campagnes, token }) => {
  const response = await apiPost("/api/campagnes/create", {
    body: campagnes,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.createdCount) {
    return response;
  }
  throw new Error("Erreur dans la création des campagnes");
};
