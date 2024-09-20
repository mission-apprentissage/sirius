import { _get } from "../utils/httpClient";

export const fetchLocalEtablissements = async ({ token, search }) => {
  let url = `/api/etablissements?`;

  const params = [];

  if (search) {
    params.push(`search=${search}`);
  }

  url += params.join("&");

  const response = await _get(url, token);

  if (response.error) {
    throw new Error("Erreur dans le chargement des établissements localaux");
  }

  return response;
};
