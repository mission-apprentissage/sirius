import React, { useContext, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import Button from "../Components/Form/Button";
import { UserContext } from "../context/UserContext";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalEtablissements from "../hooks/useFetchLocalEtablissements";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";
import Step1 from "./CreateCampagnes/Step1";
import Step2 from "./CreateCampagnes/Step2";
import { creationSubmitHandler } from "./submitHandlers";
import { formateDateToInputFormat } from "./utils";
import { useGet } from "../common/hooks/httpHooks";
import { _get } from "../utils/httpClient";

const CreateCampagne = ({ etablissementSiret }) => {
  const [allDiplomesSelectedFormations, setAllDiplomesSelectedFormations] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentEtablissementSiret =
    userContext.siret || etablissementSiret || userContext.etablissements[0].siret;

  const [remoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(currentEtablissementSiret);

  const [localEtablissement, loadingLocalEtablissement, errorLocalEtablissement] =
    useFetchLocalEtablissements(currentEtablissementSiret);

  const localFormationQuery =
    localEtablissement?.length &&
    localEtablissement[0].formationIds
      ?.filter(Boolean)
      ?.map((id) => `id=${id}`)
      .join("&");

  const [localFormations, loadingLocalFormations, errorLocalFormations] =
    useFetchLocalFormations(localFormationQuery);

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const initialValues = allDiplomesSelectedFormations.map((allDiplomesSelectedFormation) => ({
    nomCampagne: "",
    startDate: formateDateToInputFormat(new Date()),
    endDate: formateDateToInputFormat(new Date(), 1),
    seats: 0,
    formationId: allDiplomesSelectedFormation,
    questionnaireId: validatedQuestionnaire[0]?._id,
  }));

  const formik = useFormik({
    initialValues: { campagnes: initialValues },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const formations = remoteFormations.filter((remoteFormation) =>
        allDiplomesSelectedFormations.includes(remoteFormation.id)
      );

      const results = [];

      for (const campagne of values.campagnes) {
        const [freshLocalEtablissement] = await _get(
          `/api/etablissements?data.siret=${currentEtablissementSiret}`,
          userContext.token
        );
        const { formationId, ...cleanUpCampagne } = campagne;

        const formation = formations.find((formation) => formation._id === formationId);
        const result = await creationSubmitHandler(
          {
            formation: formation,
            ...cleanUpCampagne,
            localEtablissement: freshLocalEtablissement,
          },
          userContext
        );

        results.push(result);
      }

      const isAllSuccess = results.every((result) => result.status === "success");
      setIsSubmitting(false);
      if (isAllSuccess) {
        navigate({
          pathname: `/campagnes/gestion`,
          search: `${searchParams.toString()}&status=success&count=${results.length}`,
        });
      } else {
        navigate({
          pathname: `/campagnes/gestion`,
          search: `${searchParams.toString()}&status=error`,
        });
      }
    },
  });

  return (
    <Stack w="100%">
      {step === 1 && (
        <Step1
          hasError={
            !!(
              errorRemoteFormations ||
              errorLocalEtablissement ||
              errorLocalFormations ||
              errorQuestionnaires
            )
          }
          isLoading={
            !!(
              loadingRemoteFormations ||
              loadingLocalEtablissement ||
              loadingLocalFormations ||
              loadingQuestionnaires
            )
          }
          remoteFormations={remoteFormations}
          localFormations={localFormations}
          allDiplomesSelectedFormations={allDiplomesSelectedFormations}
          setAllDiplomesSelectedFormations={setAllDiplomesSelectedFormations}
        />
      )}
      {step === 2 && (
        <Step2
          allDiplomesSelectedFormations={allDiplomesSelectedFormations}
          selectedFormations={remoteFormations.filter((remoteFormation) =>
            allDiplomesSelectedFormations.includes(remoteFormation.id)
          )}
          setStep={setStep}
          formik={formik}
        />
      )}
      <Box display="flex" justifyContent="center" w="100%" mb="25px">
        {step === 1 && (
          <Button isDisabled={!allDiplomesSelectedFormations.length} onClick={() => setStep(2)}>
            Sélectionner {allDiplomesSelectedFormations.length} formation
            {allDiplomesSelectedFormations.length > 1 ? "s" : ""}{" "}
          </Button>
        )}
        {step === 2 && (
          <Button
            isDisabled={!allDiplomesSelectedFormations.length}
            onClick={formik.submitForm}
            isLoading={isSubmitting}
          >
            Créer {allDiplomesSelectedFormations.length} campagne
            {allDiplomesSelectedFormations.length > 1 ? "s" : ""}{" "}
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default CreateCampagne;
