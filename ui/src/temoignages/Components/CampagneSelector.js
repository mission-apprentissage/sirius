import React, { useState, useEffect, useContext } from "react";
import { Select } from "chakra-react-select";
import { useGet } from "../../common/hooks/httpHooks";
import { _get } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";

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

const CampagneSelector = ({ temoignagesSetter, selectedCampagneSetter = null }) => {
  const [userContext] = useContext(UserContext);
  const [campagnes, loadingCampagnes, errorCampagnes] = useGet(`/api/campagnes/`);
  const [allCampagnes, setAllCampagnes] = useState([]);
  const [selectedCampagne, setSelectedCampagne] = useState(null);

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
        temoignagesSetter(result);
      }
    };
    getTemoignages();
  }, [selectedCampagne]);

  return (
    <Select
      id="nomCampagne"
      name="nomCampagne"
      variant="filled"
      size="lg"
      placeholder="Campagnes"
      isSearchable
      isLoading={loadingCampagnes}
      isDisabled={!!errorCampagnes}
      chakraStyles={styles}
      options={
        allCampagnes.length > 0 &&
        allCampagnes.map((campagne) => ({
          value: campagne._id,
          label: campagne.nomCampagne,
        }))
      }
      onChange={({ value }) => {
        const campagne = campagnes.find((campagne) => campagne._id === value);
        setSelectedCampagne(campagne);
        selectedCampagneSetter && selectedCampagneSetter(campagne);
      }}
    />
  );
};

export default CampagneSelector;
