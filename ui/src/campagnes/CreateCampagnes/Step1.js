import React, { useContext } from "react";
import { Spinner, Accordion, Text, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Header from "../Components/Header";
import Blackboard from "../../assets/images/blackboard.svg";
import CreateCampagneTable from "../Components/CreateCampagneTable";
import { uniqueDiplomeTypesFromFormation, orderFormationsByDiplomeType } from "../utils";
import FormError from "../../Components/Form/FormError";

const Step1 = ({
  hasError,
  isLoading,
  remoteFormations,
  localFormations,
  allDiplomesSelectedFormations,
  setAllDiplomesSelectedFormations,
}) => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  const existingFormationCatalogueIds = localFormations?.map((formation) => formation.data._id);

  return (
    <Stack direction="column" w="100%" mb="25px">
      <Header
        title="Créer des campagnes"
        img={Blackboard}
        hasGoBackButton
        goBackLabel="Retour gestion des campagnes"
        goBackOnClick={() => navigate("/campagnes/gestion")}
      >
        <Text fontWeight="600" color="brand.black.500">
          Lorsque vous sélectionnez une formation vous créez une campagne Sirius.
        </Text>
        <Text color="brand.black.500">
          Dans cette première version de Sirius, seules les formations infra-bac sont disponibles
        </Text>
      </Header>
      <Text w="100%" color="brand.black.500">
        Formations extraites du Catalogue des offres de formations en apprentissage du réseau des
        CARIF OREF.{" "}
        <strong>
          Un problème ? <u>Dites le nous</u>
        </strong>
      </Text>
      {isLoading ? (
        <Spinner size="xl" />
      ) : hasError ? (
        <FormError title="Une erreur est survenue" hasError errorMessages={[]} />
      ) : (
        <Accordion allowMultiple>
          {uniqueDiplomeTypesFromFormation(remoteFormations)?.map((diplomeType) => (
            <CreateCampagneTable
              key={diplomeType}
              diplomeType={diplomeType}
              formations={orderFormationsByDiplomeType(remoteFormations)[diplomeType]}
              userContext={userContext}
              allDiplomesSelectedFormations={allDiplomesSelectedFormations}
              setAllDiplomesSelectedFormations={setAllDiplomesSelectedFormations}
              existingFormationCatalogueIds={existingFormationCatalogueIds}
            />
          ))}
        </Accordion>
      )}
    </Stack>
  );
};

export default Step1;
