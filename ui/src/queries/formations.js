import { apiGet, apiPost } from "../utils/api.utils";

export const fetchRemoteFormations = async ({ query = null, page = 1, pageSize = 30 }) => {
  let url = `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formations?page=${page}&limit=${pageSize}`;

  if (query) {
    url += `&${query}`;
  }

  const res = await fetch(url);
  const response = await res.json();

  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des formations du catalogue");
};

export const fetchAlreadyExistingFormations = async ({ campagneIds, token }) => {
  const response = await apiPost("/formations/already-existing", {
    body: campagneIds,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des formations déjà créées");
};

export const fetchLocalFormations = async ({ token, etablissementSiret, search }) => {
  let url = `/formations?`;

  const params = [];

  if (etablissementSiret) {
    params.push(`etablissementSiret=${etablissementSiret}`);
  }

  if (search) {
    params.push(`search=${search}`);
  }

  url += params.join("&");

  const response = await apiGet(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.error) {
    throw new Error("Erreur dans le chargement des formations locales");
  }

  return response;
};
