import React, { useContext } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
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

const initialValues = {
  nomCampagne: "",
  localEtablissement: "",
  formation: "",
  startDate: "",
  endDate: "",
  seats: "0",
  questionnaireId: "",
};

const CreateCampagne = () => {
  const toast = useToast();
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={initialValues}
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
      {(formik) => <CampagneForm formik={formik} buttonMessage="Créer" />}
    </Formik>
  );
};

export default CreateCampagne;
