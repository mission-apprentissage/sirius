import React, { useContext } from "react";
import { Spinner, Box, Text, Stack, Accordion } from "@chakra-ui/react";
import { useGet } from "../common/hooks/httpHooks";
import { UserContext } from "../context/UserContext";
import { USER_ROLES } from "../constants";
import Header from "./Components/Header";
import Team from "../assets/images/team.svg";
import Statistics from "./Components/Statistics";
import ManageCampagneTable from "./Components/ManageCampagneTable";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import {
  orderCampagnesByDiplomeType,
  uniqueDiplomeTypesFromCampagne,
  orderFormationsByDiplomeType,
} from "./utils";
import FormError from "../Components/Form/FormError";

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

const ViewCampagnes = () => {
  const [userContext] = useContext(UserContext);

  const campagneQuery =
    userContext.currentUserRole === USER_ROLES.ETABLISSEMENT ? `?siret=${userContext.siret}` : "";

  const [campagnes, loadingCampagnes, errorCampagnes] = useGet(`/api/campagnes${campagneQuery}`);

  const [formations, loadingFormations, errorFormations] = useFetchRemoteFormations(
    userContext.siret
  );

  return (
    <Stack direction="column" w="100%">
      <Header hasActionButton title="Statistiques" img={Team}>
        {(loadingCampagnes || errorCampagnes) && !campagnes.length ? (
          <Spinner size="xl" />
        ) : (
          <Statistics campagnes={campagnes} />
        )}
      </Header>
      <Text fontSize="5xl" fontWeight="600" w="100%" color="brand.blue.700">
        Gérer mes campagnes
      </Text>
      <Box>
        {loadingCampagnes || loadingFormations ? (
          <Spinner size="xl" />
        ) : errorCampagnes || errorFormations ? (
          <FormError title="Une erreur est survenue" hasError errorMessages={[]} />
        ) : (
          <Accordion allowToggle>
            {uniqueDiplomeTypesFromCampagne(campagnes)?.map((diplomeType) => (
              <ManageCampagneTable
                key={diplomeType}
                diplomeType={diplomeType}
                campagnes={orderCampagnesByDiplomeType(campagnes)[diplomeType]}
                formations={orderFormationsByDiplomeType(formations)[diplomeType]}
                userContext={userContext}
              />
            ))}
          </Accordion>
        )}
      </Box>
    </Stack>
  );
};

export default ViewCampagnes;
