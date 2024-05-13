import { _get } from "../utils/httpClient";

export const fetchLocalEtablissements = async ({ token, search }) => {
  let url = `/api/etablissements`;

  if (search) {
    url += `?search=${search}`;
  }

  const response = await _get(url, token);

  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement des établissements");
};
