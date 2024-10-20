import { apiGet, apiPost, apiPostFile } from "../utils/api.utils";

export const fetchTemoignagesDatavisualisation = async ({ campagneIds, token }) => {
  const response = await apiPost("/temoignages/datavisualisation", {
    body: campagneIds,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};

export const fetchDatavisualisationFormation = async ({ intituleFormation }) => {
  const response = await apiGet(`/temoignages/datavisualisation/formation?intituleFormation=${intituleFormation}`, {});
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};

export const fetchDatavisualisationEtablissement = async ({ uai }) => {
  const response = await apiGet(`/temoignages/datavisualisation/etablissement?uai=${uai}`, {});
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
  const response = await apiGet(
    `/temoignages/uncompliant?type=${type}&duration=${duration}&includeUnavailableDuration=${includeUnavailableDuration}&answeredQuestions=${answeredQuestions}&page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des témognages non conformes");
};

export const deleteTemoignages = async ({ temoignagesIds, token }) => {
  const response = await apiPost("/temoignages/delete", {
    body: temoignagesIds,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response) {
    return response;
  }
  throw new Error("Erreur dans la suppression des témoignages");
};

export const fetchTemoignagesXlsExport = async ({ campagneIds, token }) => {
  const response = await apiPostFile("/temoignages/xls-export", {
    body: campagneIds,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de l'export des témoignages");
};
