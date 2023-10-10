import React, { useContext, useState } from "react";
import { Spinner, Box, Text, Stack } from "@chakra-ui/react";
import { UserContext } from "../context/UserContext";
import Header from "./Components/Header";
import Blackboard from "../assets/images/blackboard.svg";
import CreateCampagneTable from "./Components/CreateCampagneTable";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalEtablissements from "../hooks/useFetchLocalEtablissements";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";

import { uniqueDiplomeTypesFromFormation, orderFormationsByDiplomeType } from "./utils";
import Button from "../Components/Form/Button";
import FormError from "../Components/Form/FormError";

const CreateCampagne = () => {
  const [allDiplomesSelectedFormations, setAllDiplomesSelectedFormations] = useState([]);
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

  const existingFormationCatalogueIds = localFormations?.map((formation) => formation.data._id);

  return (
    <Stack direction="column" w="100%" mb="25px">
      <Header
        title="Créer des campagnes"
        img={Blackboard}
        hasGoBackButton
        goBackLabel="Retour gestion des campagnes"
        goBackUrl="/campagnes/gestion"
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
      {loadingRemoteFormations || loadingLocalEtablissement || loadingLocalFormations ? (
        <Spinner size="xl" />
      ) : errorRemoteFormations || errorLocalEtablissement || errorLocalFormations ? (
        <FormError title="Une erreur est survenue" hasError errorMessages={[]} />
      ) : (
        <>
          <Box>
            {uniqueDiplomeTypesFromFormation(remoteFormations)?.map((diplomeType) => (
              <CreateCampagneTable
                key={diplomeType}
                diplomeType={diplomeType}
                formations={orderFormationsByDiplomeType(remoteFormations)[diplomeType]}
                userContext={userContext}
                setAllDiplomesSelectedFormations={setAllDiplomesSelectedFormations}
                existingFormationCatalogueIds={existingFormationCatalogueIds}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="center">
            <Button isDisabled={!allDiplomesSelectedFormations.length}>
              Sélectionner {allDiplomesSelectedFormations.length} formation
              {allDiplomesSelectedFormations.length > 1 ? "s" : ""}{" "}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};

export default CreateCampagne;
