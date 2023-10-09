import React, { useContext } from "react";
import { Spinner, Box, Text, Stack } from "@chakra-ui/react";
import { useGet } from "../common/hooks/httpHooks";
import { UserContext } from "../context/UserContext";
import { USER_ROLES } from "../constants";
import Header from "./Components/Header";
import Team from "../assets/images/team.svg";
import Statistics from "./Components/Statistics";
import ManageCampagneTable from "./Components/ManageCampagneTable";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";

export const sortingOptions = [
  { label: "Formation (A-Z)", value: { id: "Formation", desc: false } },
  { label: "Formation (Z-A)", value: { id: "Formation", desc: true } },
  { label: "Nom d'usage formation (A-Z)", value: { id: "nomCampagne", desc: false } },
  { label: "Nom d'usage formation (Z-A)", value: { id: "nomCampagne", desc: true } },
  { label: "Début campagne (Ancienne-Récente)", value: { id: "startDate", desc: false } },
  { label: "Début campagne (Récente-Ancienne)", value: { id: "startDate", desc: true } },
  { label: "Fin campagne (Ancienne-Récente)", value: { id: "endDate", desc: false } },
  { label: "Fin campagne (Récente-Ancienne)", value: { id: "endDate", desc: true } },
  { label: "Apprenti·es (0-1)", value: { id: "seats", desc: false } },
  { label: "Apprenti·es (1-0)", value: { id: "seats", desc: true } },
  { label: "Complétion (0-1)", value: { id: "Complétion", desc: false } },
  { label: "Complétion (1-0)", value: { id: "Complétion", desc: true } },
];

const uniqueDiplomeTypesFromCampagne = (campagnes) => [
  ...new Set(campagnes.map((campagne) => campagne.formation?.data?.diplome)),
];

const uniqueDiplomeTypesFromFormation = (formations) => [
  ...new Set(formations?.map((formation) => formation?.diplome)),
];

const orderCampagnesByDiplomeType = (campagnes) => {
  const orderedCampagnes = {};
  uniqueDiplomeTypesFromCampagne(campagnes)?.forEach((diplomeType) => {
    const campagnesByDiplomeType = campagnes.filter(
      (campagne) => campagne.formation?.data?.diplome === diplomeType
    );
    orderedCampagnes[diplomeType] = campagnesByDiplomeType;
  });
  return orderedCampagnes;
};

const orderFormationsByDiplomeType = (formations) => {
  const orderedFormations = {};
  uniqueDiplomeTypesFromFormation(formations)?.forEach((diplomeType) => {
    const formationsByDiplomeType = formations.filter(
      (formation) => formation?.diplome === diplomeType
    );
    orderedFormations[diplomeType] = formationsByDiplomeType;
  });
  return orderedFormations;
};

const ViewCampagnes = () => {
  const [userContext] = useContext(UserContext);

  const campagneQuery =
    userContext.currentUserRole === USER_ROLES.ETABLISSEMENT ? `?siret=${userContext.siret}` : "";

  const [campagnes, loadingCampagnes, errorCampagnes] = useGet(`/api/campagnes${campagneQuery}`);

  const [formations, loadingFormations, errorFormations] = useFetchRemoteFormations(
    userContext.siret
  );

  if (loadingCampagnes || loadingFormations || errorCampagnes || errorFormations)
    return <Spinner size="xl" />;

  return (
    <Stack direction="column" w="100%">
      <Header hasActionButton title="Statistiques" img={Team}>
        {campagnes.length && <Statistics campagnes={campagnes} />}
      </Header>
      <Text fontSize="5xl" fontWeight="600" w="100%" color="brand.blue.700">
        Gérer mes campagnes
      </Text>
      <Box>
        {uniqueDiplomeTypesFromCampagne(campagnes)?.map((diplomeType) => (
          <ManageCampagneTable
            key={diplomeType}
            diplomeType={diplomeType}
            campagnes={orderCampagnesByDiplomeType(campagnes)[diplomeType]}
            formations={orderFormationsByDiplomeType(formations)[diplomeType]}
            userContext={userContext}
          />
        ))}
      </Box>
    </Stack>
  );
};

export default ViewCampagnes;
