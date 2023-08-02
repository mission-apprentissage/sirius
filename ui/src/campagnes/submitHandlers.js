import { _post, _put, _delete } from "../utils/httpClient";

export const creationSubmitHandler = async (values, userContext) => {
  const { etablissement, formation, localEtablissement } = values;

  let etablissementResult;
  let updatedEtablissementResult;

  // création de la campagne et de la formation dans tout les cas
  const campagneResult = await _post(
    `/api/campagnes/`,
    {
      nomCampagne: values.nomCampagne,
      startDate: values.startDate,
      endDate: values.endDate,
      seats: values.seats,
      questionnaireId: values.questionnaireId,
    },
    userContext.token
  );

  const formationResult = await _post(
    `/api/formations/`,
    {
      data: formation,
      campagneId: campagneResult._id,
      createdBy: userContext.currentUserId,
    },
    userContext.token
  );

  //1er cas : utilisation d'un établissement déjà existant
  if (localEtablissement) {
    updatedEtablissementResult = await _put(
      `/api/etablissements/${localEtablissement._id}`,
      {
        formationIds: [...localEtablissement.formationIds, formationResult._id],
      },
      userContext.token
    );
  }

  //2ème cas : utilisation d'un nouvel établissement
  if (etablissement) {
    etablissementResult = await _post(
      `/api/etablissements/`,
      {
        data: etablissement,
        formationIds: [formationResult._id],
        createdBy: userContext.currentUserId,
      },
      userContext.token
    );
  }

  return campagneResult._id &&
    formationResult._id &&
    (updatedEtablissementResult?.modifiedCount || etablissementResult?._id)
    ? {
        status: "success",
        description: "La campagne a été créée",
      }
    : {
        status: "error",
        description: "Une erreur est survenue",
      };
};

export const editionSubmitHandler = async (values, previousValues, userContext) => {
  const { etablissement, formation, localEtablissement } = values;

  let etablissementResult;
  let formationResult;
  let deletedFormation;
  let updatedEtablissementResult;
  let updatedPreviousEtablissementResult;

  // 1er cas : pas de modification d'établissement ni de formation. Pas de check nécessaire car la campagne est mise à jour dans tous les cas

  // 2ème cas : même établissement mais formation différente
  const isSameEtablissementButDifferentFormation = !!(
    values.localEtablissement?._id === previousValues.etablissement?._id &&
    values.formation?._id !== previousValues.formation?._id
  );

  // 3ème cas : établissement différent mais déjà connu localement et formation différente
  const isDifferentEtablissementButAlreadyKnownLocallyAndDifferentFormation = !!(
    values?.localEtablissement &&
    values?.localEtablissement._id !== previousValues.etablissement._id &&
    values.formation._id !== previousValues.formation._id
  );

  // 4ème cas : établissement différent inconnu localement et formation différente
  const isDifferentEtablissementAndUnknownLocallyAndDifferentFormation = !!(
    values?.etablissement && !values.localEtablissement
  );

  // Mise à jour de la campagne dans tous les cas
  const campagneResult = await _put(
    `/api/campagnes/${previousValues._id}`,
    {
      nomCampagne: values.nomCampagne,
      startDate: values.startDate,
      endDate: values.endDate,
      seats: values.seats,
      questionnaireId: values.questionnaireId,
    },
    userContext.token
  );

  if (
    isSameEtablissementButDifferentFormation ||
    isDifferentEtablissementButAlreadyKnownLocallyAndDifferentFormation ||
    isDifferentEtablissementAndUnknownLocallyAndDifferentFormation
  ) {
    // Suppression de la formation courante dans les cas 2,3,4
    deletedFormation = await _delete(
      `/api/formations/${previousValues?.formation?._id}`,
      userContext.token
    );

    // Ajout d'une nouvelle formation dans les cas 2,3,4
    formationResult = await _post(
      `/api/formations/`,
      {
        data: formation,
        campagneId: previousValues?._id,
        createdBy: userContext.currentUserId,
      },
      userContext.token
    );
  }

  // Mise à jour de l'établissement courant dans les cas 2, 3 et 4
  if (
    isSameEtablissementButDifferentFormation ||
    isDifferentEtablissementButAlreadyKnownLocallyAndDifferentFormation ||
    isDifferentEtablissementAndUnknownLocallyAndDifferentFormation
  ) {
    const formationIdsWithoutPreviousFormation = previousValues.etablissement.formationIds.filter(
      (formationId) => formationId !== previousValues.formation._id
    );

    // Ajout de l'id de la nouvelle formation dans le cas 2 sinon uniquement retrait de l'id précédent dans le cas 3 et 4
    const formationIds = isSameEtablissementButDifferentFormation
      ? [...formationIdsWithoutPreviousFormation, formationResult._id]
      : formationIdsWithoutPreviousFormation;

    updatedPreviousEtablissementResult = await _put(
      `/api/etablissements/${previousValues.etablissement._id}`,
      {
        formationIds: formationIds,
      },
      userContext.token
    );

    // Mise à jour de l'établissement déjà connu dans le cas 3
    if (isDifferentEtablissementButAlreadyKnownLocallyAndDifferentFormation) {
      updatedEtablissementResult = await _put(
        `/api/etablissements/${localEtablissement._id}`,
        {
          formationIds: [...localEtablissement.formationIds, formationResult._id],
        },
        userContext.token
      );
    }

    // Ajout du nouvel établissement dans le cas 4
    if (isDifferentEtablissementAndUnknownLocallyAndDifferentFormation) {
      etablissementResult = await _post(
        `/api/etablissements/`,
        {
          data: etablissement,
          formationIds: [formationResult._id],
          createdBy: userContext.currentUserId,
        },
        userContext.token
      );
    }
  }

  const isCampagneAndFormationSuccess = !!(
    campagneResult?.modifiedCount &&
    deletedFormation?.deletedCount &&
    formationResult?._id
  );

  const isSuccessCase1 = campagneResult?.modifiedCount;
  const isSuccessCase2 =
    isCampagneAndFormationSuccess && updatedPreviousEtablissementResult?.modifiedCount;
  const isSuccessCase3 = isCampagneAndFormationSuccess && updatedEtablissementResult?.modifiedCount;
  const isSuccessCase4 = isCampagneAndFormationSuccess && etablissementResult?._id;

  return isSuccessCase1 || isSuccessCase2 || isSuccessCase3 || isSuccessCase4
    ? {
        status: "success",
        description: "La campagne a été mise à jour",
      }
    : {
        status: "error",
        description: "Une erreur est survenue",
      };
};
