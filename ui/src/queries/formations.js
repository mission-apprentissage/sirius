import { _get, _post } from "../utils/httpClient";

export const fetchRemoteFormations = async ({ query = null, page = 1, pageSize = 30 }) => {
  let url = `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formations?page=${page}&limit=${pageSize}`;

  if (query) {
    url += `&${query}`;
  }

  const response = await _get(url);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des formations du catalogue");
};

export const fetchAlreadyExistingFormations = async ({ campagneIds, token }) => {
  let url = `/api/formations/already-existing`;

  const response = await _post(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des formations déjà créées");
};
