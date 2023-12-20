import React, { useState, useEffect } from "react";
import useFetchEtablissementsSuivi from "../hooks/useFetchEtablissementsSuivi";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import SuiviEtablissementsTable from "./SuiviEtablissements/SuiviEtablissementsTable";
import SuiviEtablissementsStatistics from "./SuiviEtablissements/SuiviEtablissementsStatistics";
import SuiviEtablissementsSearch from "./SuiviEtablissements/SuiviEtablissementsSearch";

const SuiviEtablissementsPage = () => {
  const [displayedEtablissements, setDisplayedEtablissements] = useState([]);
  const [search, setSearch] = useState([]);

  const [etablissementsSuivi, etablissementsSuiviLoading, etablissementsSuiviError] =
    useFetchEtablissementsSuivi();

  useEffect(() => {
    setDisplayedEtablissements(etablissementsSuivi);
  }, [etablissementsSuivi]);

  if (!displayedEtablissements || etablissementsSuiviLoading || etablissementsSuiviError)
    return <Spinner />;

  return (
    <VStack mt="5" w="100%">
      <Box w="100%">
        <Text fontSize="5xl" fontWeight="600" color="brand.blue.700">
          Statistiques des établissements
        </Text>
      </Box>
      <SuiviEtablissementsStatistics etablissements={displayedEtablissements} />
      <SuiviEtablissementsSearch
        etablissements={etablissementsSuivi}
        setDisplayedEtablissements={setDisplayedEtablissements}
        search={search}
        setSearch={setSearch}
      />
      <SuiviEtablissementsTable etablissements={displayedEtablissements} />
    </VStack>
  );
};

export default SuiviEtablissementsPage;
