import React, { useContext } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Spinner, useToast } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useGet } from "../common/hooks/httpHooks";
import { UserContext } from "../context/UserContext";
import { creationSubmitHandler } from "./submitHandlers";
import CampagneForm from "./CampagneForm";

const validationSchema = Yup.object({
  nomCampagne: Yup.string().required("Ce champ est obligatoire"),
  formation: Yup.object().required("Ce champ est obligatoire"),
  startDate: Yup.string().required("Ce champ est obligatoire"),
  endDate: Yup.string().required("Ce champ est obligatoire"),
  seats: Yup.string().required("Ce champ est obligatoire"),
  questionnaireId: Yup.string().required("Ce champ est obligatoire"),
});

const getInitialValues = (campagne) => ({
  nomCampagne: campagne ? campagne.nomCampagne : "",
  localEtablissement: campagne ? campagne.etablissement : "",
  formation: "",
  startDate: campagne ? campagne.startDate : "",
  endDate: campagne ? campagne.endDate : "",
  seats: campagne ? campagne.seats : "0",
  questionnaireId: campagne ? campagne.questionnaireId : "",
});

const DuplicateCampagne = () => {
  const { id } = useParams();
  const toast = useToast();
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const [campagne, loading, error] = useGet(`/api/campagnes/${id}`);

  if (loading) {
    return (
      <Box w="100vw" h="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    toast({
      title: "Une erreur est survenue",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Formik
      initialValues={getInitialValues(campagne)}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        const { status, description } = await creationSubmitHandler(values, userContext);

        toast({
          description,
          status,
          duration: 5000,
          isClosable: true,
        });

        if (status === "success") {
          navigate("/campagnes/gestion");
        }
      }}
    >
      {(formik) => (
        <CampagneForm formik={formik} buttonMessage="Dupliquer" siret={userContext.siret} />
      )}
    </Formik>
  );
};

export default DuplicateCampagne;
