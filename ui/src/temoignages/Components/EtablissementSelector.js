import React, { useState, useEffect } from "react";
import { Select } from "chakra-react-select";
import useFetchLocalEtablissements from "../../hooks/useFetchLocalEtablissements";

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

const EtablissementSelector = ({ selectedEtablissementSetter = null }) => {
  const [fetchedLocalEtablissements, loadingLocalEtablissements, errorLocalEtablissements] =
    useFetchLocalEtablissements();
  const [allEtablissements, setAllEtablissements] = useState([]);

  useEffect(() => {
    if (fetchedLocalEtablissements) {
      setAllEtablissements(fetchedLocalEtablissements);
    }
  }, [fetchedLocalEtablissements]);

  return (
    <Select
      id="nomEtablissement"
      name="nomEtablissement"
      variant="filled"
      size="lg"
      placeholder="Etablissements"
      isSearchable
      isLoading={loadingLocalEtablissements}
      isDisabled={loadingLocalEtablissements || !!errorLocalEtablissements}
      chakraStyles={styles}
      options={
        allEtablissements.length > 0
          ? allEtablissements.map((etablissement) => ({
              value: etablissement._id,
              label: etablissement?.data?.onisep_nom || etablissement?.data?.enseigne,
            }))
          : []
      }
      onChange={({ value }) => {
        const etablissement = allEtablissements.find(
          (etablissement) => etablissement._id === value
        );
        selectedEtablissementSetter && selectedEtablissementSetter(etablissement);
      }}
    />
  );
};

export default EtablissementSelector;
