import { _post, _put } from "../utils/httpClient";

export const multiCreationSubmitHandler = async (payload, userContext) => {
  const result = await _post(`/api/campagnes/multi`, payload, userContext.token);
  return result.createdCount
    ? {
        status: "success",
        createdCount: result.createdCount,
      }
    : {
        status: "error",
        description: "Une erreur est survenue",
      };
};

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
