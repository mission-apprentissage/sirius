import { apiGet, apiPost } from "../utils/api.utils";

export const fetchJobs = async ({ token }) => {
  const url = `/jobs`;

  const response = await apiGet(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.error) {
    throw new Error("Erreur dans le chargement des jobs");
  }

  return response;
};

export const startJob = async ({ jobType, onlyAnonymized, forceGem, notCorrectedAndNotAnonymized, token }) => {
  const url = `/jobs/start`;

  const response = await apiPost(url, {
    body: { jobType, onlyAnonymized, forceGem, notCorrectedAndNotAnonymized },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }

  throw new Error("Erreur dans le déclenchement du job");
};

export const fetchJob = async ({ jobId, token }) => {
  const url = `/jobs/${jobId}`;

  const response = await apiGet(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.error) {
    throw new Error("Erreur dans le chargement du job");
  }

  return response;
};

export const stopJob = async ({ jobId, token }) => {
  const url = `/jobs/${jobId}/stop`;

  const response = await apiPost(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }

  throw new Error("Erreur dans l'arrêt du job");
};
