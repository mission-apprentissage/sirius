import React, { useContext } from "react";
import { Spinner, Box, Text, Stack } from "@chakra-ui/react";
import { UserContext } from "../../context/UserContext";
import Header from "../Components/Header";
import Search from "../../assets/images/search.svg";
import CreateCampagneTable from "../Components/CreateCampagneTable";
import { uniqueDiplomeTypesFromFormation, orderFormationsByDiplomeType } from "../utils";
import FormError from "../../Components/Form/FormError";

const Step2 = ({
  hasError,
  isLoading,
  remoteFormations,
  localFormations,
  setAllDiplomesSelectedFormations,
  setStep,
}) => {
  const [userContext] = useContext(UserContext);

  const existingFormationCatalogueIds = localFormations?.map((formation) => formation.data._id);

  return (
    <Stack direction="column" w="100%" mb="25px">
      <Header
        title="Paramétrer mes campagnes"
        img={Search}
        hasGoBackButton
        goBackLabel="Précédent"
        goBackOnClick={() => setStep(1)}
      >
        <Text fontWeight="600" color="brand.black.500">
          Lorsque vous sélectionnez une formation vous créez une campagne Sirius.
        </Text>
        <Text color="brand.black.500">
          Dans cette première version de Sirius, seules les formations infra-bac sont disponibles
        </Text>
      </Header>
      <Box></Box>
    </Stack>
  );
};

export default Step2;
