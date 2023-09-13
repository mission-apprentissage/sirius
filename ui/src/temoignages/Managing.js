import React, { useState, useEffect } from "react";
import { Flex, Box, HStack } from "@chakra-ui/react";
import TemoignagesTable from "./Components/TemoignagesTable";
import EtablissementSelector from "./Components/EtablissementSelector";
import FormationSelector from "./Components/FormationSelector";

const Managing = () => {
  const [temoignages, setTemoignages] = useState([]);
  const [selectedEtablissement, setSelectedEtablissement] = useState(null);

  useEffect(() => {
    setTemoignages([]);
  }, [selectedEtablissement]);

  return (
    <Flex direction="column" w="100%" m="auto" bgColor="white">
      <Flex direction="column" w="100%" m="auto" bgColor="white">
        <Box p="64px 72px 32px 72px" bgColor="#FAF5FF" boxShadow="md">
          <HStack w="100%">
            <Box w="50%">
              <EtablissementSelector selectedEtablissementSetter={setSelectedEtablissement} />
            </Box>
            <Box w="50%">
              {selectedEtablissement && (
                <FormationSelector
                  temoignagesSetter={setTemoignages}
                  formationIds={selectedEtablissement.formationIds}
                />
              )}
            </Box>
          </HStack>
        </Box>
        {temoignages.length > 0 && <TemoignagesTable temoignages={temoignages} />}
      </Flex>
    </Flex>
  );
};

export default Managing;
