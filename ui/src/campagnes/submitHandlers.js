import { apiPut } from "../utils/api.utils";

export const simpleEditionSubmitHandler = async (campagneId, values, userContext) => {
  const campagneResult = await apiPut(`/api/campagnes/:id`, {
    params: { id: campagneId },
    body: values,
    headers: {
      Authorization: `Bearer ${userContext.token}`,
    },
  });

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
