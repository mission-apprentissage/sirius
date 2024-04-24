import { _post } from "../utils/httpClient";

export const fetchTemoignagesDatavisualisation = async ({ campagneIds, token }) => {
  let url = `/api/temoignages/datavisualisation`;

  const response = await _post(url, campagneIds, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de la datavisualisation des campagnes");
};
