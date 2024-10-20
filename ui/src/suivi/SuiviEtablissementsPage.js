import { Box, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useFetchEtablissementsSuivi from "../hooks/useFetchEtablissementsSuivi";
import SuiviEtablissementsFilters from "./SuiviEtablissements/SuiviEtablissementsFilters";
import SuiviEtablissementsSearch from "./SuiviEtablissements/SuiviEtablissementsSearch";
import SuiviEtablissementsStatistics from "./SuiviEtablissements/SuiviEtablissementsStatistics";
import SuiviEtablissementsTable from "./SuiviEtablissements/SuiviEtablissementsTable";

const SuiviEtablissementsPage = () => {
  const [displayedEtablissements, setDisplayedEtablissements] = useState([]);
  const [search, setSearch] = useState([]);

  const [etablissementsSuivi, etablissementsSuiviLoading, etablissementsSuiviError] = useFetchEtablissementsSuivi();

  useEffect(() => {
    setDisplayedEtablissements(etablissementsSuivi);
  }, [etablissementsSuivi]);

  if (!displayedEtablissements || etablissementsSuiviLoading || etablissementsSuiviError) return <Spinner />;

  return (
    <VStack my="5" w="100%">
      <Box w="100%" my="5">
        <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
          Statistiques des établissements
        </Text>
      </Box>
      <SuiviEtablissementsStatistics etablissements={displayedEtablissements} />
      <HStack w="100%" my="5">
        <SuiviEtablissementsSearch
          etablissements={etablissementsSuivi}
          setDisplayedEtablissements={setDisplayedEtablissements}
          search={search}
          setSearch={setSearch}
        />
        <SuiviEtablissementsFilters
          etablissements={etablissementsSuivi}
          setDisplayedEtablissements={setDisplayedEtablissements}
          setSearch={setSearch}
        />
      </HStack>
      <SuiviEtablissementsTable etablissements={displayedEtablissements} />
    </VStack>
  );
};

export default SuiviEtablissementsPage;
