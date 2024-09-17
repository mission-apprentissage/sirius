import React, { useState } from "react";
import { Select } from "chakra-react-select";

const filterOptions = [
  {
    label: "Avec campagnes",
    value: "withCampagnes",
  },
  {
    label: "Sans campagnes",
    value: "withoutCampagnes",
  },
  {
    label: "Avec témoignages",
    value: "withTemoignages",
  },
  {
    label: "Sans témoignages",
    value: "withoutTemoignages",
  },
];

const SuiviEtablissementsFilters = ({ setDisplayedEtablissements, etablissements, setSearch }) => {
  const [selectedFilters, setSelectedFilters] = useState([...filterOptions]);

  const handleFilter = (selectedFilters) => {
    let filteredEtablissements = [...etablissements];

    const isFilterSelected = (filterValue) =>
      selectedFilters.some((filter) => filter.value === filterValue);

    if (!isFilterSelected("withCampagnes")) {
      filteredEtablissements = filteredEtablissements.filter(
        (etablissement) => etablissement.campagnesCount === 0
      );
    }
    if (!isFilterSelected("withoutCampagnes")) {
      filteredEtablissements = filteredEtablissements.filter(
        (etablissement) => etablissement.campagnesCount !== 0
      );
    }

    if (!isFilterSelected("withTemoignages")) {
      filteredEtablissements = filteredEtablissements.filter(
        (etablissement) => etablissement.temoignagesCount === 0
      );
    }

    if (!isFilterSelected("withoutTemoignages")) {
      filteredEtablissements = filteredEtablissements.filter(
        (etablissement) => etablissement.temoignagesCount !== 0
      );
    }

    setSelectedFilters(selectedFilters);
    setDisplayedEtablissements(filteredEtablissements);
    setSearch("");
  };

  return (
    <Select
      value={selectedFilters}
      isMulti
      options={filterOptions}
      placeholder="Filtres"
      size="lg"
      isSearchable={false}
      chakraStyles={{
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: "brand.black.500",
        }),
        container: (baseStyles) => ({
          ...baseStyles,
          borderColor: "brand.blue.400",
        }),
        multiValue: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "brand.blue.500",
          color: "white",
        }),
      }}
      isClearable={false}
      onChange={handleFilter}
    />
  );
};

export default SuiviEtablissementsFilters;
