import { apiGet, apiPatch } from "../utils/api.utils";

export const fetchVerbatims = async ({
  token,
  selectedStatus,
  etablissementSiret,
  showOnlyDiscrepancies,
  formationId,
  page,
}) => {
  let url = `/verbatims`;
  const params = new URLSearchParams();

  if (page !== undefined) {
    params.append("page", page);
  }

  if (selectedStatus) {
    params.append("selectedStatus", selectedStatus);
  }

  if (etablissementSiret) {
    params.append("etablissementSiret", etablissementSiret);
  }

  if (formationId) {
    params.append("formationId", formationId);
  }

  if (showOnlyDiscrepancies) {
    params.append("showOnlyDiscrepancies", showOnlyDiscrepancies);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await apiGet(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.error) {
    throw new Error("Erreur dans le chargement des verbatims");
  }
  return response;
};

export const fetchVerbatimsCount = async ({ token, etablissementSiret, formationId, showOnlyDiscrepancies }) => {
  let url = `/verbatims/count`;
  const params = new URLSearchParams();

  if (etablissementSiret) {
    params.append("etablissementSiret", etablissementSiret);
  }

  if (formationId) {
    params.append("formationId", formationId);
  }

  if (showOnlyDiscrepancies) {
    params.append("showOnlyDiscrepancies", showOnlyDiscrepancies);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  const response = await apiGet(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.error) {
    throw new Error("Erreur dans le chargement du count des verbatims");
  }
  return response;
};

export const patchVerbatims = async ({ verbatims, token }) => {
  const response = await apiPatch("/verbatims", {
    body: verbatims,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.error) {
    throw new Error("Erreur dans la mise à jour des verbatims");
  }
  return response;
};

export const patchVerbatimFeedback = async ({ verbatimId, isUseful }) => {
  const response = await apiPatch(`/verbatims/${verbatimId}/feedback`, {
    body: { isUseful },
  });

  if (response.error) {
    throw new Error("Erreur dans la mise à jour du feedback");
  }
  return response;
};
