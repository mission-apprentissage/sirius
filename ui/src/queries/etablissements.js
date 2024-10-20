import { apiGet } from "../utils/api.utils";

export const fetchLocalEtablissements = async ({ token, search }) => {
  let url = `/api/etablissements?`;

  const params = [];

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
    throw new Error("Erreur dans le chargement des établissements localaux");
  }

  return response;
};
