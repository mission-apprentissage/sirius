import { _get } from "../utils/httpClient";

export const fetchQuestionnaire = async ({ id }) => {
  let url = `/api/questionnaires/${id}`;

  const response = await _get(url);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement du questionnaire");
};
