import React, { useContext, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Button from "../Components/Form/Button";
import { UserContext } from "../context/UserContext";
import { EtablissementsContext } from "../context/EtablissementsContext";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalEtablissements from "../hooks/useFetchLocalEtablissements";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";
import Step1 from "./CreateCampagnes/Step1";
import Step2 from "./CreateCampagnes/Step2";
import { multiCreationSubmitHandler } from "./submitHandlers";
import { formateDateToInputFormat } from "./utils";
import { useGet } from "../common/hooks/httpHooks";

const CreateCampagne = () => {
  const [allDiplomesSelectedFormations, setAllDiplomesSelectedFormations] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext] = useContext(UserContext);
  const [etablissementsContext] = useContext(EtablissementsContext);
  const navigate = useNavigate();

  const [remoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(etablissementsContext.siret);

  const [localEtablissement, loadingLocalEtablissement, errorLocalEtablissement] =
    useFetchLocalEtablissements(etablissementsContext.siret);

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

  const initialValues = allDiplomesSelectedFormations.reduce(
    (accumulator, allDiplomesSelectedFormation) => {
      accumulator[allDiplomesSelectedFormation] = {
        nomCampagne: "",
        startDate: formateDateToInputFormat(new Date()),
        endDate: formateDateToInputFormat(new Date(), 1),
        seats: 0,
        formationId: allDiplomesSelectedFormation,
        questionnaireId: validatedQuestionnaire[0]?._id,
      };
      return accumulator;
    },
    {}
  );

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const formattedValues = Object.values(values);

      const formations = remoteFormations.filter((remoteFormation) =>
        allDiplomesSelectedFormations.includes(remoteFormation.id)
      );

      const formationsWithCreator = formations.map((formation) => ({
        ...formation,
        createdBy: userContext.currentUserId,
      }));

      const payload = {
        etablissementSiret: etablissementsContext.siret,
        campagnes: formattedValues.map((campagne) => {
          const { formationId, ...rest } = campagne;
          return {
            ...rest,
            formation: formationsWithCreator.find((formation) => formation.id === formationId),
          };
        }),
      };

      const result = await multiCreationSubmitHandler(payload, userContext);

      setIsSubmitting(false);
      if (result.status === "success") {
        navigate(`/campagnes/gestion?status=success&count=${result.createdCount}`);
      } else {
        navigate(`/campagnes/gestion?status=error`);
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
