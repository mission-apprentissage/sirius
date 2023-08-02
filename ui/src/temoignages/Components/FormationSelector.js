import React, { useState, useEffect, useContext } from "react";
import { Box, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { _get } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";
import useFetchLocalFormations from "../../hooks/useFetchLocalFormations";
import useFetchCampagne from "../../hooks/useFetchCampagne";

const styles = {
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
};

const formatOptionLabel = (props) => {
  return (
    <Box>
      <Text>{props.data.intitule_long}</Text>
      <Text fontSize="xs">
        {props.data.lieu_formation_adresse_computed || props.data.lieu_formation_adresse}
      </Text>
      <Text fontSize="xs">{props.data.tags?.join(" - ")}</Text>
    </Box>
  );
};

const FormationSelector = ({
  temoignagesSetter,
  selectedFormationSetter = null,
  formationIds,
  campagneSetter,
}) => {
  const [userContext] = useContext(UserContext);
  const localFormationQuery = formationIds
    ?.filter(Boolean)
    .map((id) => `id=${id}`)
    .join("&");

  const [formations, loadingFormations, errorFormations] =
    useFetchLocalFormations(localFormationQuery);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [campagne, loadingCampagne, errorCampagne] = useFetchCampagne(
    selectedFormation?.campagneId
  );

  useEffect(() => {
    const getTemoignages = async () => {
      if (selectedFormation) {
        const result = await _get(
          `/api/temoignages?campagneId=${selectedFormation.campagneId}`,
          userContext.token
        );
        temoignagesSetter(result);
      }
    };
    getTemoignages();
  }, [selectedFormation]);

  useEffect(() => {
    if (!loadingCampagne && !errorCampagne && campagne) {
      campagneSetter(campagne);
    }
  }, [campagne]);

  return (
    <Select
      id="nomFormation"
      name="nomFormation"
      variant="filled"
      size="lg"
      placeholder="Formations"
      isSearchable
      isLoading={loadingFormations}
      isDisabled={!!errorFormations}
      chakraStyles={styles}
      getOptionLabel={(option) =>
        `${option.data?.intitule_long} - ${option.data?.tags.join(", ")} \n ${
          option.data?.lieu_formation_adresse_computed
        }`
      }
      getOptionValue={(option) => option._id}
      formatOptionLabel={formatOptionLabel}
      options={formations}
      onChange={(value) => {
        setSelectedFormation(value);
        selectedFormationSetter(value);
      }}
    />
  );
};

export default FormationSelector;
