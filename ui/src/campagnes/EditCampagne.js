import React from "react";
import { useToast, Spinner } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import CampagneForm from "./CampagneForm";
import { useGet } from "../common/hooks/httpHooks";

const EditCampagne = () => {
  const { id } = useParams();
  const toast = useToast();
  const [campagne, loading, error] = useGet(`/api/campagnes/${id}`);

  if (error) {
    toast({
      title: "Une erreur est survenue",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  if (loading) return <Spinner size="xl" />;

  return <CampagneForm campagne={campagne} />;
};

export default EditCampagne;
