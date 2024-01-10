import React, { useState } from "react";
import { Select } from "chakra-react-select";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";

const filterOptions = [
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.PENDING],
    value: VERBATIM_STATUS.PENDING,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.VALIDATED],
    value: VERBATIM_STATUS.VALIDATED,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.TO_FIX],
    value: VERBATIM_STATUS.TO_FIX,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.ALERT],
    value: VERBATIM_STATUS.ALERT,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.REJECTED],
    value: VERBATIM_STATUS.REJECTED,
  },
  {
    label: VERBATIM_STATUS_LABELS[VERBATIM_STATUS.GEM],
    value: VERBATIM_STATUS.GEM,
  },
];

const ModerationFilters = ({ setDisplayedVerbatims, verbatims }) => {
  const [selectedFilters, setSelectedFilters] = useState([...filterOptions]);

  const handleFilter = (selectedFilters) => {
    let filteredVerbatims = [...verbatims];

    const isFilterSelected = (filterValue) =>
      selectedFilters.some((filter) => filter.value === filterValue);

    if (!isFilterSelected(VERBATIM_STATUS.PENDING)) {
      filteredVerbatims = filteredVerbatims.filter(
        (verbatim) =>
          typeof verbatim.value !== "string" && verbatim.value?.status !== VERBATIM_STATUS.PENDING
      );
    }

    if (!isFilterSelected(VERBATIM_STATUS.VALIDATED)) {
      filteredVerbatims = filteredVerbatims.filter(
        (verbatim) => verbatim.value?.status !== VERBATIM_STATUS.VALIDATED
      );
    }

    if (!isFilterSelected(VERBATIM_STATUS.TO_FIX)) {
      filteredVerbatims = filteredVerbatims.filter(
        (verbatim) => verbatim.value?.status !== VERBATIM_STATUS.TO_FIX
      );
    }

    if (!isFilterSelected(VERBATIM_STATUS.ALERT)) {
      filteredVerbatims = filteredVerbatims.filter(
        (verbatim) => verbatim.value?.status !== VERBATIM_STATUS.ALERT
      );
    }

    if (!isFilterSelected(VERBATIM_STATUS.REJECTED)) {
      filteredVerbatims = filteredVerbatims.filter(
        (verbatim) => verbatim.value?.status !== VERBATIM_STATUS.REJECTED
      );
    }

    if (!isFilterSelected(VERBATIM_STATUS.GEM)) {
      filteredVerbatims = filteredVerbatims.filter(
        (verbatim) => verbatim.value?.status !== VERBATIM_STATUS.GEM
      );
    }

    setSelectedFilters(selectedFilters);
    setDisplayedVerbatims(filteredVerbatims);
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

export default ModerationFilters;