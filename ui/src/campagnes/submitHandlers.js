import { _put } from "../utils/httpClient";

export const simpleEditionSubmitHandler = async (campagneId, values, userContext) => {
  const campagneResult = await _put(`/api/campagnes/${campagneId}`, values, userContext.token);

  return campagneResult
    ? {
        status: "success",
        description: "La campagne a été mise à jour",
      }
    : {
        status: "error",
        description: "Une erreur est survenue",
      };
};
