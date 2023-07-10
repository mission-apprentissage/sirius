import React, { useState, useEffect, useContext } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useGet } from "../common/hooks/httpHooks";
import { _get } from "../utils/httpClient";
import { UserContext } from "../context/UserContext";
import TemoignagesTable from "./Components/TemoignagesTable";

const Managing = () => {
  const [userContext] = useContext(UserContext);
  const [campagnes, loadingCampagnes, errorCampagnes] = useGet(`/api/campagnes/`);
  const [allCampagnes, setAllCampagnes] = useState([]);
  const [selectedCampagne, setSelectedCampagne] = useState(null);
  const [temoignages, setTemoignages] = useState([]);

  useEffect(() => {
    if (campagnes) {
      setAllCampagnes(campagnes);
    }
  }, [campagnes]);

  useEffect(() => {
    const getTemoignages = async () => {
      if (selectedCampagne) {
        const result = await _get(
          `/api/temoignages?campagneId=${selectedCampagne._id}`,
          userContext.token
        );
        setTemoignages(result);
      }
    };
    getTemoignages();
  }, [selectedCampagne]);

  return (
    <Flex direction="column" w="100%" m="auto" bgColor="white">
      <Flex direction="column" w="100%" m="auto" bgColor="white">
        <Box p="64px 72px 32px 72px" bgColor="#FAF5FF" boxShadow="md">
          <Box w="100%">
            <Select
              id="nomCampagne"
              name="nomCampagne"
              variant="filled"
              size="lg"
              placeholder="Campagnes"
              isSearchable
              isLoading={loadingCampagnes}
              isDisabled={!!errorCampagnes}
              chakraStyles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "purple.600!important",
                  color: "white",
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  color: "white",
                }),
                dropdownIndicator: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "purple.600",
                  color: "white",
                }),
                option: (baseStyles) => ({
                  "&:hover": {
                    backgroundColor: "white",
                    color: "purple.600",
                  },
                  ...baseStyles,
                  backgroundColor: "purple.600",
                  color: "white",
                }),
                menuList: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor: "purple.600",
                }),
              }}
              options={
                allCampagnes.length > 0 &&
                allCampagnes.map((campagne) => ({
                  value: campagne._id,
                  label: campagne.nomCampagne,
                }))
              }
              onChange={({ value }) =>
                setSelectedCampagne(campagnes.find((campagne) => campagne._id === value))
              }
            />
          </Box>
        </Box>
        {temoignages.length > 0 && <TemoignagesTable temoignages={temoignages} />}
      </Flex>
    </Flex>
  );
};

export default Managing;
