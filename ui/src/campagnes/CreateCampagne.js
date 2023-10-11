import React, { useContext, useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import Button from "../Components/Form/Button";
import { UserContext } from "../context/UserContext";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalEtablissements from "../hooks/useFetchLocalEtablissements";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";
import Step1 from "./CreateCampagnes/Step1";
import Step2 from "./CreateCampagnes/Step2";
import { multipleCampagnesCreationSubmitHandler } from "./submitHandlers";

const CreateCampagne = () => {
  const [allDiplomesSelectedFormations, setAllDiplomesSelectedFormations] = useState([]);
  const [step, setStep] = useState(1);
  const [userContext] = useContext(UserContext);

  const [remoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(userContext.siret);

  const [localEtablissement, loadingLocalEtablissement, errorLocalEtablissement] =
    useFetchLocalEtablissements(userContext.siret);

  const localFormationQuery =
    localEtablissement?.length &&
    localEtablissement[0].formationIds
      ?.filter(Boolean)
      ?.map((id) => `id=${id}`)
      .join("&");

  const [localFormations, loadingLocalFormations, errorLocalFormations] =
    useFetchLocalFormations(localFormationQuery);

  const initialValues = allDiplomesSelectedFormations.map(() => ({
    nomCampagne: "",
    startDate: "",
    endDate: "",
    seats: 0,
    questionnaireId: "",
    etablissement: null,
    formation: null,
  }));

  const formik = useFormik({
    initialValues: { campagnes: initialValues },
    onSubmit: async (values) => {
      console.log({ values });
    },
  });

  return (
    <Stack w="100%">
      {step === 1 && (
        <Step1
          hasError={!!(errorRemoteFormations || errorLocalEtablissement || errorLocalFormations)}
          isLoading={
            !!(loadingRemoteFormations || loadingLocalEtablissement || loadingLocalFormations)
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
          <Button isDisabled={!allDiplomesSelectedFormations.length} onClick={formik.submitForm}>
            Créer {allDiplomesSelectedFormations.length} campagne
            {allDiplomesSelectedFormations.length > 1 ? "s" : ""}{" "}
          </Button>
        )}
      </Box>
    </Stack>
  );
};

export default CreateCampagne;
