import React, { useContext } from "react";
import { Accordion, Box, Text, Stack } from "@chakra-ui/react";
import { UserContext } from "../../context/UserContext";
import Header from "../Components/Header";
import Search from "../../assets/images/search.svg";
import ConfigureCampagneTable from "../Components/ConfigureCampagneTable";
import { uniqueDiplomeTypesFromFormation, orderFormationsByDiplomeType } from "../utils";

const Step2 = ({ selectedFormations, allDiplomesSelectedFormations, setStep, formik }) => {
  const [userContext] = useContext(UserContext);

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
      <Box>
        <Accordion allowToggle>
          {uniqueDiplomeTypesFromFormation(selectedFormations)?.map((diplomeType, index) => (
            <ConfigureCampagneTable
              key={diplomeType}
              index={index}
              diplomeType={diplomeType}
              formations={orderFormationsByDiplomeType(selectedFormations)[diplomeType]}
              userContext={userContext}
              allDiplomesSelectedFormations={allDiplomesSelectedFormations}
              formik={formik}
            />
          ))}
        </Accordion>
      </Box>
    </Stack>
  );
};

export default Step2;