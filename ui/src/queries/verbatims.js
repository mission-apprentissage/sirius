import { _get } from "../utils/httpClient";

export const fetchVerbatims = async ({
  token,
  selectedStatus,
  etablissementSiret,
  showOnlyDiscrepancies,
  formationId,
  page,
}) => {
  let url = `/api/verbatims`;
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

  const response = await _get(url, token);

  if (response.error) {
    throw new Error("Erreur dans le chargement des verbatims");
  }
  return response;
};

export const fetchVerbatimsCount = async ({
  token,
  etablissementSiret,
  formationId,
  showOnlyDiscrepancies,
}) => {
  let url = `/api/verbatims/count`;
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

  const response = await _get(url, token);

  if (response.error) {
    throw new Error("Erreur dans le chargement du count des verbatims");
  }
  return response;
};
