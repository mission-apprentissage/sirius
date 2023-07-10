import React from "react";
import { useToast, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import QuestionnaireForm from "./QuestionnaireForm";
import { useGet } from "../common/hooks/httpHooks";

const EditQuestionnaire = () => {
  const { id } = useParams();
  const toast = useToast();
  const [questionnaire, loading, error] = useGet(`/api/questionnaires/${id}`);

  if (error) {
    toast({
      title: "Une erreur est survenue",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  if (loading) return <Spinner size="xl" />;

  return <QuestionnaireForm editedQuestionnaire={questionnaire} />;
};

export default EditQuestionnaire;
