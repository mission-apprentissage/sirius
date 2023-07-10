import React, { useState } from "react";
import { Flex, Box } from "@chakra-ui/react";
import TemoignagesTable from "./Components/TemoignagesTable";
import CampagneSelector from "./Components/CampagneSelector";

const Managing = () => {
  const [temoignages, setTemoignages] = useState([]);

  return (
    <Flex direction="column" w="100%" m="auto" bgColor="white">
      <Flex direction="column" w="100%" m="auto" bgColor="white">
        <Box p="64px 72px 32px 72px" bgColor="#FAF5FF" boxShadow="md">
          <Box w="100%">
            <CampagneSelector temoignagesSetter={setTemoignages} />
          </Box>
        </Box>
        {temoignages.length > 0 && <TemoignagesTable temoignages={temoignages} />}
      </Flex>
    </Flex>
  );
};

export default Managing;
